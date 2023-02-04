import { Injectable } from '@nestjs/common';
import { FileElementResponse } from './dto/file-element.response';
import { format } from 'date-fns';
import { path } from 'app-root-path';
import { ensureDir, writeFile } from 'fs-extra';
import * as sharp from 'sharp';
import { MFile } from './mfile.class';

@Injectable()
export class FilesService {
	async saveFiles(files: MFile[]): Promise<FileElementResponse[]> {
		const dateFolder = format(new Date(), 'yyyy-MM-dd');
		const uploadFolder = `${path}/uploads/${dateFolder}`;
		await ensureDir(uploadFolder);
		const res: FileElementResponse[] = [];
		for (const file of files) {
			await writeFile(`${uploadFolder}/${file.originalname}`, file.buffer);
			res.push({
				url: `/uploads/${dateFolder}/${file.originalname}`,
				name: file.originalname,
			});
		}
		return res;
	}

	convertToWebP(file: Buffer): Promise<Buffer> {
		return sharp(file).webp().toBuffer();
	}
}

/*
    dateFolder - это название папки куда мы будем всё сохранять
    format(new Date(), 'yyyy-MM-dd') - так мы будем красиво называть наши папки отформартированые уже по дате

    uploadFolder - куда мы будём все складывать 

    path - это будет корень проекта(рут директорию с его апликешйенами) и она будет одинакого на всех операционых системах, и на продакшене и на деве
    `${path}/uploads` - вот эта uploads - это то куда мы будем складывать
    uploads - мы добавим её в гитигнор что мы не комиттить тестовые файлы, которые мы будем загружать

    ensureDir - теперь нужно проверить существует ли этот путь в uploadFolder, если нет то нужно его создать, ensureDir как раз это проверит

    await writeFile(`${uploadFolder}/${file.originalname}`) - так мы сохраним по пути uploadFolder оригинальное название файла file.originalname
    а сохраняем мы file.buffer вторым аргументом

    res.push({ url: `${dateFolder}/${file.originalname}`}) мы не будем использовать домен, а только передадим dateFolder что бы с доменом уже Фронт занимался
    url: `${dateFolder}/${file.originalname}` - это url по которому мы сможем достать изображение

    sharp
    convertToWebP(file: Buffer) - библиотека sharp принимает на вход файл в буффере для ковертации и возвращает тоже буффер который мы уже конвертируем

    Так как метод convertToWebP вернёт нам файл крнвертируемый в Буффер, мы уже не сможем здесь
    saveFiles(files: Express.Multer.File[]) типизировать наш file как  Express.Multer.File[] потому что мы не сможем создать инстенс этого файла
    По-этому мы создадим MFile и будем проверять какой файл нам приходит file: Express.Multer.File | MFile
*/
