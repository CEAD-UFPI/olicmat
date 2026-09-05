import { Module } from "@nestjs/common";
import { ConvitesService } from "./convites.service.js";
import {
  AdminConvitesController,
  ConvitesController,
} from "./convites.controller.js";
import { EmailModule } from "../email/email.module.js";

@Module({
  imports: [EmailModule],
  controllers: [AdminConvitesController, ConvitesController],
  providers: [ConvitesService],
  exports: [ConvitesService],
})
export class ConvitesModule {}
