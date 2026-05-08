import {
  Controller,
  Post,
  Body,
  BadRequestException,
  Inject,
} from "@nestjs/common";
import { AuthService } from "./auth.service.js";
import { loginSchema, registerSchema } from "./dto/login.dto.js";
import type { LoginDto, RegisterDto } from "./dto/login.dto.js";

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
}
