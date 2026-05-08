import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./auth/auth.module.js";
import { UsersModule } from "./users/users.module.js";
import { OlimpiadaModule } from "./olimpiada/olimpiada.module.js";
import { LmsModule } from "./lms/lms.module.js";
import { CongressoModule } from "./congresso/congresso.module.js";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UsersModule,
    OlimpiadaModule,
    LmsModule,
    CongressoModule,
  ],
})
export class AppModule {}
