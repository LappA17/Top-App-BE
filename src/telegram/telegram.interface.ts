import { ModuleMetadata } from '@nestjs/common';

export interface ITelegramOptions {
	chatId: string;
	token: string;
}

export interface ITelegramModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
	useFactory: (...args: any[]) => Promise<ITelegramOptions> | ITelegramOptions;
	inject?: any[];
}

/*
    Мы создаём интерфейс, а не класс, потому что нам не нужно будет использовать декораторы, и не какие доп методы нам не нужны

	Мы создали для ТелеграмМодуля новый интерфейс и extends Pick<ModuleMetadata, 'imports'> что бы он мог принимать Импорты 
*/
