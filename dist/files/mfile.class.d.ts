/// <reference types="node" />
/// <reference types="multer" />
export declare class MFile {
    originalname: string;
    buffer: Buffer;
    constructor(file: Express.Multer.File | MFile);
}
