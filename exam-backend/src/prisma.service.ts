import { Injectable, OnModuleInit, OnModuleDestroy, Global, Module } from "@nestjs/common";
import { PrismaClient } from "../../backend/generated/prisma/index.js";
import { PrismaPg } from "@prisma/adapter-pg";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL,
      max: parseInt(process.env.DB_POOL_SIZE || "20", 10),
      idleTimeoutMillis: 30000,
    });
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
