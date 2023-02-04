import { Controller } from '@nestjs/common';
import { HttpCode, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { FileElementResponse } from './dto/file-element.response';
import { FilesService } from './files.service';
import { MFile } from './mfile.class';

@Controller('files')
export class FilesController {
	constructor(private readonly filesService: FilesService) {}
	@Post('upload')
	@HttpCode(200)
	@UseGuards(JwtAuthGuard)
	@UseInterceptors(FileInterceptor('files'))
	async uploadFile(@UploadedFile() file: Express.Multer.File): Promise<FileElementResponse[]> {
		const saveArray: MFile[] = [new MFile(file)];
		if (file.mimetype.includes('image')) {
			const buffer = await this.filesService.convertToWebP(file.buffer);
			saveArray.push(
				new MFile({
					originalname: `${file.originalname.split('.')[0]}.webp`,
					buffer,
				})
			);
		}
		return this.filesService.saveFiles(saveArray);
	}
}

/*
    uploadFile - У нас будет один метод для загрузки нашего файла

    Нам нужно перехватить файл который будет передан в роут upload, для этого мы воспользуемся интерсептероми
    Интерсепторы - позволяют перехватывать какой-то запрос и приобразовывать для того что бы мы могли у фции воспользоваться напрямую к файлам
    @UseInterceptors() - это встроенный в нест интерспетор
    FileInterceptor - уже экспресовый

    FileInterceptor('files') - мы сюда будем передавать мультиплатформу, которую назовем 'files', где будет поле files в котором уже будет лежать сам файл
    @UseGuards(JwtAuthGuard) - Этот загрущик будет доступен только для админа, по-этому нам нужно его защитить

    @UploadedFile() - позволит вытащить файл из фции
    @UploadedFiles() - позволит вытащить массив из файлов

    file - у этого файла который приходит параметров в фции будет иметь тип файл, который находится в библиотеки multer
    по умолчанию нам nest который установлен на сервере экспреса нам никак не даст возможности этот тип и его как-то использовать
    что бы его использовать нужно установиь types для multer

    Нам нужно из этой фции возвращать результат сохранения
    когда мы будет конвертировать изображение - мы будем возвращать не один объект по файлу, а несколько, потому что будет несколько конвертаций

    В контроллере мы должны передавать кроме исходного файла еще и сконвертированный
    file.mimetype - это строка которая содержит тип те image.jpeg, image.png и так далее
    if (file.mimetype.includes('image')) - так мы убедимся что наша библиотка Шарп сможет с ней работать

    const saveArray: MFile[] = [new MFile(file)] - благодаря new MFile(file) мы явно сконвертируем исходный файл
    saveArray.push(webP) мы не можем просто пушнуть webP потому что это webP у нас просто буфер, а мы можем пушнуть mfile

    const saveArray: MFile[] = [new MFile(file)];
		if (file.mimetype.includes('image')) {
			const buffer = await this.filesService.convertToWebP(file.buffer);
			saveArray.push(
				new MFile({ originalname: `${file.originalname.split('.')[0]}.webP`, buffer })
			);
		}
		return this.filesService.saveFiles(saveArray);
    Теперь если у нас file.mimetype не image то мы просто сохраним один файл который пришел и всё, а если image то сделаем то всё то что в if
*/
