import { Module } from "@nestjs/common";
import { LinksConviteService } from "./links-convite.service.js";
import {
  CoordenacaoLinkConviteController,
  AdminLinksConviteController,
  LinkConvitePublicoController,
} from "./links-convite.controller.js";

@Module({
  controllers: [
    CoordenacaoLinkConviteController,
    AdminLinksConviteController,
    LinkConvitePublicoController,
  ],
  providers: [LinksConviteService],
  exports: [LinksConviteService],
})
export class LinksConviteModule {}
