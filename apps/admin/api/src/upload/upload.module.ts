import { Module } from "@nestjs/common";
import { UploadService } from "./upload.service.js";
import { UploadsController } from "./uploads.controller.js";

@Module({
  controllers: [UploadsController],
  providers: [UploadService],
  exports: [UploadService],
})
export class UploadModule {}
