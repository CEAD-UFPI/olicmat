import { OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { PrismaClient } from "../../backend/generated/prisma/index.js";
export declare class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    constructor();
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
}
