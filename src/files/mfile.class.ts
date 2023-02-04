export class MFile {
	originalname: string;
	buffer: Buffer;

	constructor(file: Express.Multer.File | MFile) {
		this.originalname = file.originalname;
		this.buffer = file.buffer;
	}
}

/*
    Так как у Express.Multer.File и MFile совпадают поля originalname и buffer -> мы напишем что this.buffer = buffer
    то-есть file.buffer и file.originalname есть как и у Express.Multer.File | MFile и нам без разницы 
*/
