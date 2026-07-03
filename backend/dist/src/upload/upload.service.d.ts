interface MulterBufferFile {
    buffer: Buffer;
    originalname: string;
    mimetype: string;
    size: number;
}
export declare class UploadService {
    constructor();
    uploadArquivo(file: MulterBufferFile, folder: string, resourceType?: "video" | "image" | "raw"): Promise<string>;
    uploadBuffer(buffer: Buffer, folder: string, filename: string, resourceType?: "video" | "image" | "raw"): Promise<string>;
}
export {};
