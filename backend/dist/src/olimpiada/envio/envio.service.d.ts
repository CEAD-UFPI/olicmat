import { PrismaService } from "../../prisma.service.js";
import { UploadService } from "../../upload/upload.service.js";
export declare class EnvioService {
    private prisma;
    private upload;
    constructor(prisma: PrismaService, upload: UploadService);
    uploadFase2(userId: string, file: Express.Multer.File, tipo: string): Promise<{
        id: string;
        status: import("../../../generated/prisma/enums.js").StatusEnvioFase2;
        inscricaoId: string;
        tipo: string;
        arquivoUrl: string;
        enviadoEm: Date;
    }>;
    uploadVideo(userId: string, file: Express.Multer.File): Promise<{
        id: string;
        status: import("../../../generated/prisma/enums.js").StatusEnvioFase2;
        inscricaoId: string;
        tipo: string;
        arquivoUrl: string;
        enviadoEm: Date;
    }>;
    uploadPortfolio(userId: string, file: Express.Multer.File): Promise<{
        id: string;
        status: import("../../../generated/prisma/enums.js").StatusEnvioFase2;
        inscricaoId: string;
        tipo: string;
        arquivoUrl: string;
        enviadoEm: Date;
    }>;
    statusEnvio(userId: string): Promise<{
        id: string;
        avaliacoes: {
            id: string;
            nota: number;
            parecer: string | null;
            avaliadoEm: Date;
        }[];
        fase2Tema: string | null;
        enviosFase2: {
            id: string;
            status: import("../../../generated/prisma/enums.js").StatusEnvioFase2;
            tipo: string;
            arquivoUrl: string;
            enviadoEm: Date;
        }[];
    }>;
}
