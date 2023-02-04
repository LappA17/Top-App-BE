import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { path } from 'app-root-path';

@Module({
	imports: [ServeStaticModule.forRoot({ rootPath: `${path}/uploads`, serveRoot: '/static' })],
	controllers: [FilesController],
	providers: [FilesService],
})
export class FilesModule {}

/*
  ServeStaticModule.forRoot - так как нам не какие конфиги не нужны - мы будем использовать методе forRoot а не forRootAsync
  rootPath - это то откуда мы будем сервить.
  В rootPath указываем корень нашего проект

  Теперь с помощью 	imports: [ServeStaticModule.forRoot({ rootPath: `${path}/uploads` })], мы в инсомние можем написать 
  http://localhost:8000/2022-10-17/CdPhotoJpeg.jpeg
  и нам отдаст по этому пути картинку
  Тем самым мы отдали статичный контент на Фронт

  Так же можно еще добавить опшины в виде serveRoot - это корень пути, который будет выдавать нам статичный файл
  serveRoor: '/static' явно укажет что бы у всех файлов что мы выдавали был префикс статик 
  И теперь буедет выдаваться по пути http://localhost:8000/static/2022-10-17/CdPhotoJpeg.jpeg
*/
