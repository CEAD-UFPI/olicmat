import { Module } from "@nestjs/common";
import { SubmissaoService } from "./submissao/submissao.service.js";
import { SubmissaoController } from "./submissao/submissao.controller.js";
import { PrismaService } from "../prisma.service.js";
import { UploadModule } from "../upload/upload.module.js";

@Module({
  imports: [UploadModule],
  controllers: [SubmissaoController],
  providers: [SubmissaoService, PrismaService],
})
export class CongressoModule {}
