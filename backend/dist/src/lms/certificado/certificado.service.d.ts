import { PrismaService } from "../../prisma.service.js";
export declare class CertificadoService {
    private prisma;
    constructor(prisma: PrismaService);
    emitir(userId: string): Promise<{
        id: string;
        cargaHoraria: number;
        userId: string;
        emitidoEm: Date;
        codigo: string;
    }>;
    meusCertificados(userId: string): Promise<{
        id: string;
        cargaHoraria: number;
        userId: string;
        emitidoEm: Date;
        codigo: string;
    }[]>;
}
