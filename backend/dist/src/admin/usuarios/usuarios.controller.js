var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, BadRequestException, } from "@nestjs/common";
import { AdminUsuariosService } from "./usuarios.service.js";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard.js";
import { RolesGuard } from "../../common/guards/roles.guard.js";
import { Roles } from "../../common/decorators/roles.decorator.js";
import { Role } from "../../../generated/prisma/client.js";
import { criarUsuarioSchema, atualizarUsuarioSchema, } from "./dto/usuarios.dto.js";
let AdminUsuariosController = class AdminUsuariosController {
    usuariosService;
    constructor(usuariosService) {
        this.usuariosService = usuariosService;
    }
    async findAll() {
        return this.usuariosService.findAll();
    }
    async findById(id) {
        return this.usuariosService.findById(id);
    }
    async create(body) {
        const parsed = criarUsuarioSchema.safeParse(body);
        if (!parsed.success) {
            throw new BadRequestException(parsed.error.flatten().fieldErrors);
        }
        return this.usuariosService.create(parsed.data);
    }
    async update(id, body) {
        const parsed = atualizarUsuarioSchema.safeParse(body);
        if (!parsed.success) {
            throw new BadRequestException(parsed.error.flatten().fieldErrors);
        }
        return this.usuariosService.update(id, parsed.data);
    }
    async delete(id) {
        return this.usuariosService.delete(id);
    }
};
__decorate([
    Get(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminUsuariosController.prototype, "findAll", null);
__decorate([
    Get(":id"),
    __param(0, Param("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminUsuariosController.prototype, "findById", null);
__decorate([
    Post(),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminUsuariosController.prototype, "create", null);
__decorate([
    Patch(":id"),
    __param(0, Param("id")),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminUsuariosController.prototype, "update", null);
__decorate([
    Delete(":id"),
    __param(0, Param("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminUsuariosController.prototype, "delete", null);
AdminUsuariosController = __decorate([
    Controller("admin/usuarios"),
    UseGuards(JwtAuthGuard, RolesGuard),
    Roles(Role.ADMIN),
    __metadata("design:paramtypes", [AdminUsuariosService])
], AdminUsuariosController);
export { AdminUsuariosController };
//# sourceMappingURL=usuarios.controller.js.map