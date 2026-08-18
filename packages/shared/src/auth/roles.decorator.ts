import { SetMetadata } from "@nestjs/common";
import type { Role } from "./roles.js";

export const ROLES_KEY = "roles";

/**
 * Decorator que marca um handler/controller com os papéis permitidos.
 * Consumido pelo `RolesGuard`.
 */
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
