import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  BadRequestException,
} from "@nestjs/common";
import { QuestoesService } from "./questoes.service.js";
import {
  criarQuestaoSchema,
  vincularQuestaoSchema,
  atualizarQuestaoSchema,
} from "./dto/questoes.dto.js";
import type { CriarQuestaoDto, VincularQuestaoDto, AtualizarQuestaoDto } from "./dto/questoes.dto.js";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard.js";
import { RolesGuard } from "../../common/guards/roles.guard.js";
import { Roles } from "../../common/decorators/roles.decorator.js";
import { Role } from "../../../generated/prisma/client.js";

@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
export class QuestoesController {
  constructor(private readonly questoesService: QuestoesService) {}

  @Roles(Role.AVALIADOR, Role.ADMIN)
  @Post("admin/provas/:provaId/questoes")
  async addToExam(
    @Param("provaId") provaId: string,
    @Body() body: CriarQuestaoDto | VincularQuestaoDto
  ) {
    // If body has questaoId, it's a link operation
    if ("questaoId" in body && body.questaoId) {
      const parsed = vincularQuestaoSchema.safeParse(body);
      if (!parsed.success) {
        throw new BadRequestException(parsed.error.flatten().fieldErrors);
      }
      return this.questoesService.linkToExam(provaId, parsed.data);
    }

    const parsed = criarQuestaoSchema.safeParse(body);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.flatten().fieldErrors);
    }
    return this.questoesService.addToExam(provaId, parsed.data);
  }

  @Roles(Role.AVALIADOR, Role.ADMIN)
  @Get("admin/questoes")
  async findAll(
    @Query("eixo") eixo?: string,
    @Query("dificuldade") dificuldade?: string
  ) {
    return this.questoesService.findAll({ eixo, dificuldade });
  }

  @Roles(Role.AVALIADOR, Role.ADMIN)
  @Get("admin/provas/:provaId/questoes")
  async findExamQuestions(@Param("provaId") provaId: string) {
    return this.questoesService.findExamQuestions(provaId);
  }

  @Roles(Role.AVALIADOR, Role.ADMIN)
  @Patch("admin/questoes/:id")
  async update(
    @Param("id") id: string,
    @Body() body: AtualizarQuestaoDto
  ) {
    const parsed = atualizarQuestaoSchema.safeParse(body);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.flatten().fieldErrors);
    }
    return this.questoesService.update(id, parsed.data);
  }

  @Roles(Role.AVALIADOR, Role.ADMIN)
  @Delete("admin/questoes/:id")
  async remove(@Param("id") id: string) {
    return this.questoesService.remove(id);
  }
}
