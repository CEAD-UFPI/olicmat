import {
  Controller,
  Post,
  Get,
  Body,
  BadRequestException,
  Inject,
  UseGuards,
  Req,
} from "@nestjs/common";
import { AuthService } from "./auth.service.js";
import { loginSchema, registerSchema } from "./dto/login.dto.js";
import type { LoginDto, RegisterDto } from "./dto/login.dto.js";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard.js";
import type { Request as ExpressReq } from "express";

interface AuthUser {
  id: string;
  email: string;
  nome: string;
  role: string;
}

@Controller("auth")
export class AuthController {
  constructor(
    @Inject(AuthService) private readonly authService: AuthService
  ) {}

  @Post("registro")
  async register(@Body() body: RegisterDto) {
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.flatten().fieldErrors);
    }
    return this.authService.register(parsed.data);
  }

  @Post("login")
  async login(@Body() body: LoginDto) {
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.flatten().fieldErrors);
    }
    return this.authService.login(parsed.data);
  }

  @Post("esqueci-senha")
  async esqueciSenha(@Body() body: { email: string }) {
    if (!body.email) {
      throw new BadRequestException("Email é obrigatório");
    }
    return this.authService.esqueciSenha(body.email);
  }

  @Post("redefinir-senha")
  async redefinirSenha(@Body() body: { token: string; novaSenha: string }) {
    if (!body.token || !body.novaSenha) {
      throw new BadRequestException("Token e nova senha são obrigatórios");
    }
    if (body.novaSenha.length < 6) {
      throw new BadRequestException("Senha deve ter no mínimo 6 caracteres");
    }
    return this.authService.redefinirSenha(body.token, body.novaSenha);
  }

  @Post("confirmar-email")
  async confirmarEmail(@Body() body: { token: string }) {
    if (!body.token) {
      throw new BadRequestException("Token é obrigatório");
    }
    return this.authService.confirmarEmail(body.token);
  }

  @UseGuards(JwtAuthGuard)
  @Get("me")
  async me(@Req() req: ExpressReq & { user: AuthUser }) {
    return req.user;
  }
}
