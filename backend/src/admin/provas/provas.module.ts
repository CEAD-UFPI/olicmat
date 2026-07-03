import { Module } from "@nestjs/common";
import { ProvasService } from "./provas.service.js";
import { ProvasController } from "./provas.controller.js";

@Module({
  controllers: [ProvasController],
  providers: [ProvasService],
  exports: [ProvasService],
})
export class ProvasModule {}
