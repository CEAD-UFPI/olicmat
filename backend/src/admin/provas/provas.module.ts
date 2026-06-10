import { Module } from "@nestjs/common";
import { ProvasService } from "./provas.service.js";
import { ProvasController } from "./provas.controller.js";
import { PrismaService } from "../../prisma.service.js";

@Module({
  controllers: [ProvasController],
  providers: [ProvasService, PrismaService],
  exports: [ProvasService],
})
export class ProvasModule {}
