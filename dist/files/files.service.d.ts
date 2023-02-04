/// <reference types="node" />
import { FileElementResponse } from './dto/file-element.response';
import { MFile } from './mfile.class';
export declare class FilesService {
    saveFiles(files: MFile[]): Promise<FileElementResponse[]>;
    convertToWebP(file: Buffer): Promise<Buffer>;
}
