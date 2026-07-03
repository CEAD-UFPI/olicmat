import { AdminUsuariosService } from "./usuarios.service.js";
import { Role } from "../../../generated/prisma/client.js";
export declare class AdminUsuariosController {
    private readonly usuariosService;
    constructor(usuariosService: AdminUsuariosService);
    findAll(): Promise<{
        id: string;
        nome: string;
        email: string;
        role: Role;
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
        role: Role;
        matricula: string;
        comprovanteUrl: string | null;
        dataNascimento: Date;
    }>;
    create(body: unknown): Promise<{
        id: string;
        nome: string;
        createdAt: Date;
        email: string;
        role: Role;
    }>;
    update(id: string, body: unknown): Promise<{
        id: string;
        nome: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        role: Role;
        matricula: string;
    }>;
    delete(id: string): Promise<{
        message: string;
    }>;
}
