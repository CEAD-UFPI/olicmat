import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app.module.js";
async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors({
        origin: (origin, callback) => {
            const allowed = process.env.FRONTEND_URL || "http://localhost:3000";
            if (!origin || origin.startsWith("http://localhost:")) {
                callback(null, true);
            }
            else if (origin === allowed) {
                callback(null, true);
            }
            else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true,
    });
    app.setGlobalPrefix("api");
    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    await app.listen(process.env.PORT ?? 3333);
    console.log(`Server running on port ${process.env.PORT ?? 3333}`);
}
bootstrap().catch((err) => {
    console.error("Bootstrap error:", err);
    process.exit(1);
});
//# sourceMappingURL=main.js.map