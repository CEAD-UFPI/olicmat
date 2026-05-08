import { PrismaService } from "../../prisma.service.js";
import { UploadService } from "../../upload/upload.service.js";
export declare class EnvioService {
    private prisma;
    private upload;
    constructor(prisma: PrismaService, upload: UploadService);
    uploadVideo(userId: string, file: Express.Multer.File): Promise<{
        id: string;
        instituicao: string;
        curso: string;
        comprovanteUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
        estado: string;
        municipio: string | null;
        periodo: number | null;
        status: import("../../../generated/prisma/enums.js").StatusInsc;
        fase2Tema: string | null;
        fase2VideoUrl: string | null;
        fase2PortfolioUrl: string | null;
        fase2Nota: number | null;
        userId: string;
        fase1Nota: number | null;
        fase1Inicio: Date | null;
        fase1Fim: Date | null;
        notaFinal: number | null;
        medalha: import("../../../generated/prisma/enums.js").Medalha | null;
    }>;
    uploadPortfolio(userId: string, file: Express.Multer.File): Promise<{
        id: string;
        instituicao: string;
        curso: string;
        comprovanteUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
        estado: string;
        municipio: string | null;
        periodo: number | null;
        status: import("../../../generated/prisma/enums.js").StatusInsc;
        fase2Tema: string | null;
        fase2VideoUrl: string | null;
        fase2PortfolioUrl: string | null;
        fase2Nota: number | null;
        userId: string;
        fase1Nota: number | null;
        fase1Inicio: Date | null;
        fase1Fim: Date | null;
        notaFinal: number | null;
        medalha: import("../../../generated/prisma/enums.js").Medalha | null;
    }>;
    statusEnvio(userId: string): Promise<{
        fase2Tema: string | null;
        fase2VideoUrl: string | null;
        fase2PortfolioUrl: string | null;
        fase2Nota: number | null;
    }>;
}
