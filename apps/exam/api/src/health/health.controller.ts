import { Controller, Get } from "@nestjs/common";
import { PrismaService } from "../prisma.service.js";

/**
 * HealthController — liveness/readiness para o Módulo Provas.
 *
 * GET /api/health        — liveness (processo vivo, sempre 200)
 * GET /api/health/ready  — readiness (verifica conectividade com o banco)
 */
@Controller("health")
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  liveness() {
    return { status: "ok", timestamp: new Date().toISOString() };
  }

  @Get("ready")
  async readiness() {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return { status: "ok", timestamp: new Date().toISOString() };
    } catch (err: any) {
      return {
        status: "degraded",
        detail: err?.message,
        timestamp: new Date().toISOString(),
      };
    }
  }
}
