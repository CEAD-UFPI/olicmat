import { PrismaService } from "../../prisma.service.js";
import { AuditoriaService } from "../auditoria/auditoria.service.js";
import type { CriarUsuarioDto, AtualizarUsuarioDto } from "./dto/usuarios.dto.js";
export declare class AdminUsuariosService {
    private prisma;
    private auditoria;
    constructor(prisma: PrismaService, auditoria: AuditoriaService);
    findAll(): Promise<{
        id: string;
        nome: string;
        email: string;
        role: import("../../../generated/prisma/enums.js").Role;
        matricula: string;
        comprovanteUrl: string | null;
        createdAt: Date;
        instituicao: string | undefined;
        curso: string | undefined;
    }[]>;
    findById(id: string): Promise<{
        id: string;
        nome: string;
        createdAt: Date;
        updatedAt: Date;
        inscricoes: {
            id: string;
            status: import("../../../generated/prisma/enums.js").StatusInsc;
            edicao: {
                ano: number;
            };
        }[];
        instituicao: {
            id: string;
            sigla: string;
            nome: string;
        } | null;
        curso: {
            id: string;
            nome: string;
        } | null;
        email: string;
        cpf: string;
        role: import("../../../generated/prisma/enums.js").Role;
        matricula: string;
        comprovanteUrl: string | null;
        dataNascimento: Date;
    }>;
    create(data: CriarUsuarioDto, actorId?: string): Promise<{
        id: string;
        nome: string;
        createdAt: Date;
        email: string;
        role: import("../../../generated/prisma/enums.js").Role;
    }>;
    update(id: string, data: AtualizarUsuarioDto, actorId?: string): Promise<{
        id: string;
        nome: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        role: import("../../../generated/prisma/enums.js").Role;
        matricula: string;
    }>;
    delete(id: string, actorId?: string): Promise<{
        message: string;
    }>;
}
