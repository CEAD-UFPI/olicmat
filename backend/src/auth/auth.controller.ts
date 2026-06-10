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
    // Placeholder — password reset flow not yet implemented
    return { message: "Se o email existir, um link de redefinição será enviado" };
  }

  @Post("redefinir-senha")
  async redefinirSenha(@Body() body: { token: string; novaSenha: string }) {
    // Placeholder — password reset flow not yet implemented
    return { message: "Senha redefinida com sucesso" };
  }

  @UseGuards(JwtAuthGuard)
  @Get("me")
  async me(@Req() req: ExpressReq & { user: AuthUser }) {
    return req.user;
  }
}
