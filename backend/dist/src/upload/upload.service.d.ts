export declare class UploadService {
    constructor();
    uploadArquivo(file: Express.Multer.File, folder: string, resourceType?: "video" | "image" | "raw"): Promise<string>;
    uploadBuffer(buffer: Buffer, folder: string, filename: string, resourceType?: "video" | "image" | "raw"): Promise<string>;
}
