import { CertificadoService } from "./certificado.service.js";
import type { Request as ExpressReq } from "express";
interface AuthUser {
    id: string;
    email: string;
    nome: string;
    role: string;
}
export declare class CertificadoController {
    private readonly certificadoService;
    constructor(certificadoService: CertificadoService);
    emitir(req: ExpressReq & {
        user: AuthUser;
    }): Promise<{
        id: string;
        cargaHoraria: number;
        userId: string;
        emitidoEm: Date;
        codigo: string;
    }>;
    listar(req: ExpressReq & {
        user: AuthUser;
    }): Promise<{
        id: string;
        cargaHoraria: number;
        userId: string;
        emitidoEm: Date;
        codigo: string;
    }[]>;
}
export {};
