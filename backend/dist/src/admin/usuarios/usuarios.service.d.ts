import { PrismaService } from "../../prisma.service.js";
import type { CriarUsuarioDto, AtualizarUsuarioDto } from "./dto/usuarios.dto.js";
export declare class AdminUsuariosService {
    private prisma;
    constructor(prisma: PrismaService);
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
        inscricao: {
            id: string;
            status: import("../../../generated/prisma/enums.js").StatusInsc;
            edicao: {
                ano: number;
            };
        } | null;
    }>;
    create(data: CriarUsuarioDto): Promise<{
        id: string;
        nome: string;
        createdAt: Date;
        email: string;
        role: import("../../../generated/prisma/enums.js").Role;
    }>;
    update(id: string, data: AtualizarUsuarioDto): Promise<{
        id: string;
        nome: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        role: import("../../../generated/prisma/enums.js").Role;
        matricula: string;
    }>;
    delete(id: string): Promise<{
        message: string;
    }>;
}
