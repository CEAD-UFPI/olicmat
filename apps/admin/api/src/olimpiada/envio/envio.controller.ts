import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { EnvioService } from "./envio.service.js";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard.js";
import type { Request as ExpressReq } from "express";

interface AuthUser {
  id: string;
  email: string;
  nome: string;
  role: string;
}

@Controller("envio")
@UseGuards(JwtAuthGuard)
export class EnvioController {
  constructor(private readonly envioService: EnvioService) {}

  @Post("video-link")
  async enviarVideoLink(
    @Request() req: ExpressReq & { user: AuthUser },
    @Body() body: { videoLink: string },
  ) {
    if (!body.videoLink) {
      throw new BadRequestException("Link do vídeo é obrigatório");
    }
    return this.envioService.enviarVideoLink(req.user.id, body.videoLink);
  }

  @Post("portfolio")
  @UseInterceptors(FileInterceptor("portfolio"))
  async uploadPortfolio(
    @Request() req: ExpressReq & { user: AuthUser },
    @UploadedFile() file: any,
  ) {
    if (!file) {
      throw new BadRequestException("Arquivo do portfólio é obrigatório");
    }
    return this.envioService.uploadPortfolio(req.user.id, file);
  }

  @Get("status")
  async status(@Request() req: ExpressReq & { user: AuthUser }) {
    return this.envioService.statusEnvio(req.user.id);
  }
}
