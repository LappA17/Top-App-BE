import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TopPageModule } from './top-page/top-page.module';
import { ProductModule } from './product/product.module';
import { ReviewModule } from './review/review.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypegooseModule } from 'nestjs-typegoose';
import { getMongoConfig } from './config/mongo.config';
import { FilesModule } from './files/files.module';
import { SitemapModule } from './sitemap/sitemap.module';
import { TelegramModule } from './telegram/telegram.module';
import { getTelegramConfig } from './config/telegram.config';
import { HhModule } from './hh/hh.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
	imports: [
		ScheduleModule.forRoot(),
		ConfigModule.forRoot(),
		TypegooseModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: getMongoConfig,
		}),
		AuthModule,
		TopPageModule,
		ProductModule,
		ReviewModule,
		FilesModule,
		TelegramModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: getTelegramConfig,
		}),
		SitemapModule,
		HhModule,
	],
})
export class AppModule {}

/*
imports: [
		//потому что мы будем работать с единнойконфигруацией во всём приложение, но елси бы нам были нужны разные .env файлы от разных модулей то мы бы могли повспользовать forEach
		ConfigModule.forRoot(),
		//здесь мы будем делать коннекшен к БД
		//мы бы могли тоже сделать forRoot() и вписать здесь параметры подключения,но будем использовать параметры из переменного окружения
		//если мы напишем TypegooseModule.forRoot(), то configService нам будет недоступен
		//forRootAsync - будет асинхронно инициализировать эту библиотеку вместе с её зависимостями
		TypegooseModule.forRootAsync({
			//чтобы использовать любой провайдер - нам нужно импортировать модуль который содержит этот провайдер
			imports: [ConfigModule],
			//inject - что мы будем встраивать в resolve зависимости
			inject: [ConfigService],
			useFactory: getMongoConfig,
		}),
		AuthModule,
		TopPageModule,
		ProductModule,
		ReviewModule,
	],

	Мы imports: [ConfigModule] импортим конфигМодуль потому что в нем нахоидтся конфигМодуль
	Инжектим inject: [ConfigService], конфигСервис что бы его могла использовать наша фектори

	ScheduleModule.forRoot() - так он подключился глобально и мы можем везде использовать декораторы для кроны

*/
