import { PrismaService } from "../../prisma.service.js";
import { UploadService } from "../../upload/upload.service.js";
interface FileBuffer {
    buffer: Buffer;
    originalname: string;
    mimetype: string;
    size: number;
}
export declare class EnvioService {
    private prisma;
    private upload;
    constructor(prisma: PrismaService, upload: UploadService);
    enviarVideoLink(userId: string, videoLink: string): Promise<{
        id: string;
        status: import("../../../generated/prisma/enums.js").StatusEnvioFase2;
        inscricaoId: string;
        tipo: string;
        arquivoUrl: string;
        videoLink: string | null;
        enviadoEm: Date;
    }>;
    uploadPortfolio(userId: string, file: FileBuffer): Promise<{
        id: string;
        status: import("../../../generated/prisma/enums.js").StatusEnvioFase2;
        inscricaoId: string;
        tipo: string;
        arquivoUrl: string;
        videoLink: string | null;
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
            videoLink: string | null;
            enviadoEm: Date;
        }[];
    }>;
}
export {};
