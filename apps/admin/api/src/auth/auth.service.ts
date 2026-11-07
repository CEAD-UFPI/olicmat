import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Throttle } from "@nestjs/throttler";
import * as bcrypt from "bcrypt";
import { randomBytes, randomUUID } from "node:crypto";
import { PrismaService } from "../prisma.service.js";
import { AuditoriaService } from "../admin/auditoria/auditoria.service.js";
import { EmailService } from "../email/email.service.js";
import type { LoginDto, RegisterDto } from "./dto/login.dto.js";
import { TOKEN_TYPE, TRANSITION_TOKEN_TTL } from "@olicmat/shared";

/**
 * Sem atividade por este tempo, a sessão é tratada como abandonada e outro
 * aparelho pode entrar. A prova aberta renova a sessão a cada 30 segundos, e o
 * tempo cobre uma falha na renovação. É o que permite voltar por outro aparelho
 * quando a bateria acaba, sem depender do suporte.
 */
const SESSAO_ATIVA_MS = 90_000;

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private auditoria: AuditoriaService,
    private emailService: EmailService,
  ) {}

  async register(data: RegisterDto) {
    const existing = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: data.email }, { cpf: data.cpf }],
      },
    });

    if (existing) {
      throw new ConflictException("Email ou CPF já cadastrado");
    }

    const senhaHash = await bcrypt.hash(data.senha, 10);

    const { senha, ...restData } = data;

    let instituicaoId: string | undefined;
    let cursoId: string | undefined;

    if (data.instituicaoId) {
      instituicaoId = data.instituicaoId;
    } else if (data.instituicao) {
      const inst = await this.prisma.instituicao.upsert({
        where: { sigla: data.instituicao.toUpperCase() },
        update: {},
        create: {
          nome: data.instituicao,
          sigla: data.instituicao.toUpperCase(),
          codigoInep: `AUTO_${Date.now()}`,
          uf: "PI",
        },
        select: { id: true },
      });
      instituicaoId = inst.id;
    }

    if (data.curso && instituicaoId) {
      const curso = await this.prisma.curso.upsert({
        where: {
          nome_instituicaoId: { nome: data.curso, instituicaoId },
        },
        update: {},
        create: {
          nome: data.curso,
          instituicaoId,
        },
        select: { id: true },
      });
      cursoId = curso.id;
    }

    const user = await this.prisma.user.create({
      data: {
        nome: restData.nome,
        nomeSocial: restData.nomeSocial ?? null,
        email: restData.email,
        cpf: restData.cpf,
        matricula: restData.matricula,
        dataNascimento: new Date(restData.dataNascimento),
        senhaHash,
        telefone: restData.telefone ?? null,
        genero: restData.genero as never ?? null,
        racaCor: restData.racaCor as never ?? null,
        possuiDeficiencia: restData.possuiDeficiencia ?? null,
        cotista: restData.cotista ?? null,
        bolsista: restData.bolsista ?? null,
        tipoBolsa: restData.tipoBolsa as never ?? null,
        instituicaoId,
        cursoId,
      },
      select: {
        id: true,
        nome: true,
        email: true,
        role: true,
        emailConfirmado: true,
        createdAt: true,
      },
    });

    // Generate email confirmation token
    const token = randomBytes(32).toString("hex");
    await this.prisma.token.create({
      data: {
        userId: user.id,
        tipo: "EMAIL_CONFIRM",
        token,
        expiraEm: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    await this.emailService.enviarConfirmacaoEmail(user.email, user.nome, token);

    const accessToken = this.generateToken(user.id, user.email, user.role);

    await this.auditoria.log(user.id, "REGISTRO", "User", user.id, { email: user.email });

    return { user, accessToken };
  }

  async login(data: LoginDto) {
    const email = data.email.trim();
    // Busca exata primeiro: é o caso comum e usa o índice único.
    const user =
      (await this.prisma.user.findUnique({ where: { email } })) ??
      (await this.prisma.user.findFirst({
        where: { email: { equals: email, mode: "insensitive" } },
      }));

    if (!user) {
      throw new UnauthorizedException("Credenciais inválidas");
    }

    const senhaValida = await bcrypt.compare(data.senha, user.senhaHash);

    if (!senhaValida) {
      throw new UnauthorizedException("Credenciais inválidas");
    }

    const sid = user.role === "ALUNO"
      ? await this.abrirSessao(user, data.dispositivo)
      : undefined;

    const accessToken = this.generateToken(user.id, user.email, user.role, sid);

    return {
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        role: user.role,
        emailConfirmado: user.emailConfirmado,
      },
      accessToken,
    };
  }

  @Throttle({ default: { limit: 3, ttl: 3600 } })
  async esqueciSenha(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Don't reveal whether the email exists
      return { message: "Se o email existir, um link de redefinição será enviado" };
    }

    const token = randomBytes(32).toString("hex");
    await this.prisma.token.create({
      data: {
        userId: user.id,
        tipo: "PASSWORD_RESET",
        token,
        expiraEm: new Date(Date.now() + 2 * 60 * 60 * 1000),
      },
    });

    await this.emailService.enviarRecuperacaoSenha(user.email, user.nome, token);

    return { message: "Se o email existir, um link de redefinição será enviado" };
  }

  async redefinirSenha(token: string, novaSenha: string) {
    const record = await this.prisma.token.findUnique({ where: { token } });

    if (!record || record.tipo !== "PASSWORD_RESET" || record.usadoEm) {
      throw new BadRequestException("Token inválido ou já utilizado");
    }

    if (new Date() > record.expiraEm) {
      throw new BadRequestException("Token expirado. Solicite um novo link de recuperação");
    }

    const senhaHash = await bcrypt.hash(novaSenha, 10);

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: record.userId },
        data: { senhaHash },
      }),
      this.prisma.token.update({
        where: { id: record.id },
        data: { usadoEm: new Date() },
      }),
    ]);

    return { message: "Senha redefinida com sucesso" };
  }

  async confirmarEmail(token: string) {
    const record = await this.prisma.token.findUnique({ where: { token } });

    if (!record || record.tipo !== "EMAIL_CONFIRM" || record.usadoEm) {
      throw new BadRequestException("Token inválido ou já utilizado");
    }

    if (new Date() > record.expiraEm) {
      throw new BadRequestException("Token expirado. Solicite um novo link de confirmação");
    }

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: record.userId },
        data: { emailConfirmado: true },
      }),
      this.prisma.token.update({
        where: { id: record.id },
        data: { usadoEm: new Date() },
      }),
    ]);

    return { message: "Email confirmado com sucesso" };
  }

  private generateToken(userId: string, email: string, role: string, sid?: string) {
    const payload = { sub: userId, email, role, ...(sid && { sid }) };
    return this.jwtService.sign(payload);
  }

  /**
   * Recusa a entrada enquanto outro aparelho estiver em uso. Derrubar a sessão
   * antiga seria mais simples, mas deixaria uma segunda pessoa com a senha tirar
   * o participante da prova.
   */
  private async abrirSessao(
    user: { id: string; sessaoId: string | null; sessaoDispositivo: string | null },
    dispositivo?: string,
  ) {
    if (dispositivo && user.sessaoId && user.sessaoDispositivo === dispositivo) {
      await this.prisma.user.update({
        where: { id: user.id },
        data: { sessaoVistaEm: new Date() },
      });
      return user.sessaoId;
    }

    const sid = randomUUID();
    // Condicional no próprio UPDATE: dois logins simultâneos não passam juntos.
    const { count } = await this.prisma.user.updateMany({
      where: {
        id: user.id,
        OR: [
          { sessaoId: null },
          { sessaoVistaEm: null },
          { sessaoVistaEm: { lt: new Date(Date.now() - SESSAO_ATIVA_MS) } },
        ],
      },
      data: { sessaoId: sid, sessaoDispositivo: dispositivo ?? null, sessaoVistaEm: new Date() },
    });

    if (count === 0) {
      // A tela da prova aberta e o painel do suporte avisam enquanto isso continuar.
      await this.prisma.user.update({
        where: { id: user.id },
        data: { sessaoConflitoEm: new Date() },
      });
      throw new ConflictException(
        "Esta conta já está em uso em outro aparelho ou navegador. Feche a outra sessão e aguarde cerca de 2 minutos, ou peça ajuda ao suporte.",
      );
    }
    return sid;
  }

  async logout(userId: string, sid?: string) {
    if (sid) {
      await this.prisma.user.updateMany({
        where: { id: userId, sessaoId: sid },
        data: { sessaoId: null, sessaoDispositivo: null, sessaoVistaEm: null },
      });
    }
    return { message: "Sessão encerrada" };
  }

  /** Prova de Fase 1 ativa na edição da inscrição mais recente do participante. */
  private async provaDoParticipante(userId: string) {
    const inscricao = await this.prisma.inscricao.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: { edicaoId: true },
    });
    if (!inscricao) return null;

    return this.prisma.prova.findFirst({
      where: {
        edicaoId: inscricao.edicaoId,
        fase: 1,
        status: { in: ["PUBLICADA", "EM_ANDAMENTO"] },
      },
      orderBy: { publicadaEm: { sort: "desc", nulls: "last" } },
      select: { janelaInicio: true },
    });
  }

  /** O horário vai junto: o painel não confia no relógio do aparelho. */
  async liberacaoProva(userId: string) {
    const prova = await this.provaDoParticipante(userId);
    return {
      agora: new Date().toISOString(),
      liberadaEm: prova?.janelaInicio?.toISOString() ?? null,
    };
  }

  async gerarTransitionToken(userId: string, sid?: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, role: true, nome: true },
    });

    if (!user) {
      throw new UnauthorizedException("Usuário não encontrado");
    }

    if (user.role === "ALUNO") {
      const inscricao = await this.prisma.inscricao.findFirst({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        select: { id: true, status: true },
      });

      if (!inscricao || inscricao.status !== "CONFIRMADA") {
        throw new BadRequestException("Inscrição não confirmada para a prova");
      }

      // A trava do botão é só visual: quem garante o horário é esta verificação.
      const prova = await this.provaDoParticipante(user.id);
      if (!prova?.janelaInicio) {
        throw new BadRequestException("A prova ainda não está disponível");
      }
      if (new Date() < prova.janelaInicio) {
        const quando = prova.janelaInicio.toLocaleString("pt-BR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "America/Sao_Paulo",
        });
        throw new BadRequestException(`A prova será liberada em ${quando}`);
      }
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      nome: user.nome,
      sid,
      type: TOKEN_TYPE.EXAM_TRANSITION,
      nonce: randomBytes(16).toString("hex"),
    };

    const transitionToken = this.jwtService.sign(payload, { expiresIn: TRANSITION_TOKEN_TTL });
    const examAppUrl = process.env.EXAM_APP_URL || "https://prova.olicmat.cead.ufpi.br";

    return {
      transitionToken,
      examAppUrl: `${examAppUrl}/auth/claim?token=${transitionToken}`,
    };
  }
}
