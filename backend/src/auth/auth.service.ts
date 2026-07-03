import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { randomBytes } from "node:crypto";
import { PrismaService } from "../prisma.service.js";
import { AuditoriaService } from "../admin/auditoria/auditoria.service.js";
import type { LoginDto, RegisterDto } from "./dto/login.dto.js";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private auditoria: AuditoriaService,
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

    if (data.instituicao) {
      const inst = await this.prisma.instituicao.upsert({
        where: { sigla: data.instituicao.toUpperCase() },
        update: {},
        create: {
          nome: data.instituicao,
          sigla: data.instituicao.toUpperCase(),
          estado: "PI",
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
        email: restData.email,
        cpf: restData.cpf,
        matricula: restData.matricula,
        dataNascimento: new Date(restData.dataNascimento),
        senhaHash,
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

    console.log(`[EMAIL CONFIRM] ${user.nome} <${user.email}> -> ${process.env.FRONTEND_URL ?? "http://localhost:3000"}/confirmar-email?token=${token}`);

    const accessToken = this.generateToken(user.id, user.email, user.role);

    await this.auditoria.log(user.id, "REGISTRO", "User", user.id, { email: user.email });

    return { user, accessToken };
  }

  async login(data: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new UnauthorizedException("Credenciais inválidas");
    }

    const senhaValida = await bcrypt.compare(data.senha, user.senhaHash);

    if (!senhaValida) {
      throw new UnauthorizedException("Credenciais inválidas");
    }

    const accessToken = this.generateToken(user.id, user.email, user.role);

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

    console.log(`[PASSWORD RESET] ${user.nome} <${user.email}> -> ${process.env.FRONTEND_URL ?? "http://localhost:3000"}/redefinir-senha?token=${token}`);

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

  private generateToken(userId: string, email: string, role: string) {
    const payload = { sub: userId, email, role };
    return this.jwtService.sign(payload);
  }
}
