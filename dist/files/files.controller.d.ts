/// <reference types="multer" />
import { FileElementResponse } from './dto/file-element.response';
import { FilesService } from './files.service';
export declare class FilesController {
    private readonly filesService;
    constructor(filesService: FilesService);
    uploadFile(file: Express.Multer.File): Promise<FileElementResponse[]>;
}
