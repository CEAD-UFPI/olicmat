import {
  Controller,
  Post,
  Get,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
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

  @Post("video")
  @UseInterceptors(FileInterceptor("video"))
  async uploadVideo(
    @Request() req: ExpressReq & { user: AuthUser },
    @UploadedFile() file: Express.Multer.File
  ) {
    return this.envioService.uploadVideo(req.user.id, file);
  }

  @Post("portfolio")
  @UseInterceptors(FileInterceptor("portfolio"))
  async uploadPortfolio(
    @Request() req: ExpressReq & { user: AuthUser },
    @UploadedFile() file: Express.Multer.File
  ) {
    return this.envioService.uploadPortfolio(req.user.id, file);
  }

  @Get("status")
  async status(@Request() req: ExpressReq & { user: AuthUser }) {
    return this.envioService.statusEnvio(req.user.id);
  }
}
