import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { randomBytes } from "crypto";
import bcrypt from "bcrypt";
import { PrismaService } from "../prisma.service.js";
import { EmailService } from "../email/email.service.js";
import { Role } from "../../generated/prisma/client.js";
import type { AceitarConviteDto } from "./dto/convites.dto.js";

/** Uma semana: prazo folgado para quem só abre o e-mail institucional às vezes. */
const VALIDADE_MS = 7 * 24 * 60 * 60 * 1000;

const ROTULO_PAPEL: Record<string, string> = {
  COMISSAO: "membro da comissão organizadora",
  COORDENADOR_CURSO: "coordenador de curso",
  AVALIADOR: "avaliador",
  ADMIN: "administrador",
};

export interface ConviteEntrada {
  nome: string;
  email: string;
  role: string;
}

export interface ResultadoLote {
  /** Convite criado e e-mail entregue ao servidor SMTP. */
  enviados: { email: string; role: string }[];
  /** Nada foi criado — endereço já cadastrado ou erro antes da criação. */
  ignorados: { email: string; motivo: string }[];
  /**
   * Convite criado, mas o e-mail não saiu. O link existe e é válido: basta
   * reenviar. Separado de `ignorados` porque a ação corretiva é outra.
   */
  falhaEnvio: { email: string; motivo: string }[];
}

@Injectable()
export class ConvitesService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
  ) {}

  /**
   * Cria convites e dispara os e-mails.
   *
   * Cada entrada é tratada isoladamente: um e-mail que falha ou um endereço
   * que já tem cadastro não interrompe o restante do lote. O retorno diz o
   * que aconteceu com cada endereço, para quem operou saber a quem cobrar.
   */
  async criarEmLote(
    entradas: ConviteEntrada[],
    criadoPor: string,
  ): Promise<ResultadoLote> {
    const enviados: ResultadoLote["enviados"] = [];
    const ignorados: ResultadoLote["ignorados"] = [];
    const falhaEnvio: ResultadoLote["falhaEnvio"] = [];

    for (const entrada of entradas) {
      const email = entrada.email.toLowerCase().trim();

      try {
        const jaUsuario = await this.prisma.user.findUnique({
          where: { email },
          select: { id: true },
        });
        if (jaUsuario) {
          ignorados.push({ email, motivo: "já possui cadastro" });
          continue;
        }

        const token = randomBytes(32).toString("hex");
        const expiraEm = new Date(Date.now() + VALIDADE_MS);

        // Reconvidar o mesmo endereço substitui o convite anterior em vez de
        // falhar: reenviar é a operação natural quando alguém perde o e-mail.
        await this.prisma.convite.upsert({
          where: { email },
          update: {
            nome: entrada.nome,
            role: entrada.role as Role,
            token,
            expiraEm,
            usadoEm: null,
            criadoPor,
          },
          create: {
            nome: entrada.nome,
            email,
            role: entrada.role as Role,
            token,
            expiraEm,
            criadoPor,
          },
        });

        // O convite já está gravado neste ponto. Uma falha de SMTP não o
        // invalida — o link continua servindo para um reenvio.
        try {
          await this.emailService.enviarConvite(
            email,
            entrada.nome,
            token,
            ROTULO_PAPEL[entrada.role] ?? entrada.role,
          );
          enviados.push({ email, role: entrada.role });
        } catch (erroEmail) {
          falhaEnvio.push({
            email,
            motivo:
              erroEmail instanceof Error ? erroEmail.message : String(erroEmail),
          });
        }
      } catch (err) {
        const motivo = err instanceof Error ? err.message : String(err);
        ignorados.push({ email, motivo });
      }
    }

    return { enviados, ignorados, falhaEnvio };
  }

  /** Dados mínimos para a tela de aceite se apresentar a quem clicou no link. */
  async buscarPorToken(token: string) {
    const convite = await this.prisma.convite.findUnique({ where: { token } });

    if (!convite) {
      throw new NotFoundException("Convite não encontrado");
    }
    if (convite.usadoEm) {
      throw new BadRequestException("Este convite já foi utilizado");
    }
    if (convite.expiraEm < new Date()) {
      throw new BadRequestException(
        "Este convite expirou. Solicite um novo à organização",
      );
    }

    return {
      nome: convite.nome,
      email: convite.email,
      role: convite.role,
    };
  }

  /**
   * Troca o convite por um usuário completo.
   *
   * O papel vem do convite, nunca do corpo da requisição — caso contrário
   * qualquer pessoa com um link válido poderia se tornar administradora.
   */
  async aceitar(token: string, dados: AceitarConviteDto) {
    const convite = await this.prisma.convite.findUnique({ where: { token } });

    if (!convite) {
      throw new NotFoundException("Convite não encontrado");
    }
    if (convite.usadoEm) {
      throw new BadRequestException("Este convite já foi utilizado");
    }
    if (convite.expiraEm < new Date()) {
      throw new BadRequestException(
        "Este convite expirou. Solicite um novo à organização",
      );
    }

    const cpfEmUso = await this.prisma.user.findUnique({
      where: { cpf: dados.cpf },
      select: { id: true },
    });
    if (cpfEmUso) {
      throw new BadRequestException("Já existe um cadastro com este CPF");
    }

    const emailEmUso = await this.prisma.user.findUnique({
      where: { email: convite.email },
      select: { id: true },
    });
    if (emailEmUso) {
      throw new BadRequestException("Já existe um cadastro com este e-mail");
    }

    const senhaHash = await bcrypt.hash(dados.senha, 10);

    // Criar o usuário e queimar o convite precisam acontecer juntos: sem a
    // transação, uma falha no meio deixaria o convite reutilizável.
    const user = await this.prisma.$transaction(async (tx) => {
      const criado = await tx.user.create({
        data: {
          nome: convite.nome,
          email: convite.email,
          cpf: dados.cpf,
          senhaHash,
          role: convite.role,
          matricula: dados.matricula ?? "",
          dataNascimento: new Date(dados.dataNascimento),
          nomeMae: dados.nomeMae ?? null,
          telefone: dados.telefone ?? null,
          // O convite chegou pelo e-mail; clicar no link já comprova o acesso.
          emailConfirmado: true,
        },
        select: { id: true, nome: true, email: true, role: true },
      });

      await tx.convite.update({
        where: { id: convite.id },
        data: { usadoEm: new Date() },
      });

      return criado;
    });

    return user;
  }

  async listar() {
    return this.prisma.convite.findMany({
      select: {
        id: true,
        nome: true,
        email: true,
        role: true,
        expiraEm: true,
        usadoEm: true,
        criadoPor: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }
}
