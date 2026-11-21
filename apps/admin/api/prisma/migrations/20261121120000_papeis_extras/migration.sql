-- Perfis adicionais por usuário (ex.: Comissão que também avalia).
ALTER TABLE "User" ADD COLUMN "papeisExtras" "Role"[] NOT NULL DEFAULT ARRAY[]::"Role"[];
