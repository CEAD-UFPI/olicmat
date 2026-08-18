import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module.js";
import { Logger } from "@nestjs/common";

async function bootstrap() {
  const logger = new Logger("ExamBackend");
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix("api");
  app.enableCors({
    origin: true,
    credentials: true,
  });

  const port = process.env.PORT || 3334;
  await app.listen(port);
  logger.log(`Exam Application API running on port ${port}`);
}
bootstrap();
