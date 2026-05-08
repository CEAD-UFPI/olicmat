import { PrismaService } from "../../prisma.service.js";
import { UploadService } from "../../upload/upload.service.js";
export declare class SubmissaoService {
    private prisma;
    private upload;
    constructor(prisma: PrismaService, upload: UploadService);
    submeter(userId: string, titulo: string, resumo: string, tipo: "ARTIGO" | "POSTER", file: Express.Multer.File): Promise<{
        id: string;
        titulo: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("../../../generated/prisma/enums.js").StatusSubm;
        userId: string;
        resumo: string;
        tipo: import("../../../generated/prisma/enums.js").TipoSubm;
        arquivoUrl: string;
    }>;
    listarPorUsuario(userId: string): Promise<{
        id: string;
        titulo: string;
        createdAt: Date;
        status: import("../../../generated/prisma/enums.js").StatusSubm;
        tipo: import("../../../generated/prisma/enums.js").TipoSubm;
    }[]>;
    listarTodas(status?: string): Promise<({
        user: {
            id: string;
            nome: string;
        };
    } & {
        id: string;
        titulo: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("../../../generated/prisma/enums.js").StatusSubm;
        userId: string;
        resumo: string;
        tipo: import("../../../generated/prisma/enums.js").TipoSubm;
        arquivoUrl: string;
    })[]>;
    atualizarStatus(id: string, status: "APROVADO" | "REJEITADO"): Promise<{
        id: string;
        titulo: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("../../../generated/prisma/enums.js").StatusSubm;
        userId: string;
        resumo: string;
        tipo: import("../../../generated/prisma/enums.js").TipoSubm;
        arquivoUrl: string;
    }>;
}
