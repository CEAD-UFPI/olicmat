import { Controller, Post, Body, BadRequestException } from "@nestjs/common";
import { AuthService } from "./auth.service.js";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("claim")
  async claimToken(@Body() body: { token: string }) {
    if (!body?.token) {
      throw new BadRequestException("Token de transição é obrigatório");
    }
    return this.authService.claimTransitionToken(body.token);
  }
}
