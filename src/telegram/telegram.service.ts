import { Inject, Injectable } from '@nestjs/common';
import { Telegraf } from 'telegraf';
import { TELEGRAM_MODULE_OPTIONS } from './telegram.constants';
import { ITelegramOptions } from './telegram.interface';

@Injectable()
export class TelegramService {
	bot: Telegraf;
	options: ITelegramOptions;

	constructor(@Inject(TELEGRAM_MODULE_OPTIONS) options: ITelegramOptions) {
		this.bot = new Telegraf(options.token);
		this.options = options;
	}

	async sendMessage(message: string, chatId: string = this.options.chatId) {
		await this.bot.telegram.sendMessage(chatId, message);
	}
}

/*
    import {Telegraf} from 'telegraf' - этот класс Telegraf и будет взаимодействовать с Телеграмом

    sendMessage(message: string, chatId: string = this.options.chatId) - у нас будет метод по отправки сообщения, он принимает сообщение которое будем отправлять и chatId - айди чата куда будет отправляться и если мы его не передадим то по умолчанию this.options.chatId то-есть дефолтный chatId из конфига

    Мы не пишем return внутр сендМеседжа await this.bot.telegram.sendMessage(chatId, message) потому что здесь он вернёт информацию о сообщение которое мы отправляем. По-этому если никаких ошибок не будет то этот метод просто отработает и месседж просто отправится

	Мы можем прям здесь в конструкторе написать что-то типа
	this.options: {
		token: this.configService и что то там уже 
	}
	То-есть мы можем заняться нашим конфигом прям здесь в Сервиса, если проект не большой то часто люди так и делают
	Но архитектурно это не красиво, потому что наши конфиги получаются разбросанными и если кто-то скачивает приложение и у нас не задокументированно что должно быть в .env то кодеру прийдется поиском искать долго и упорно все места где конфигсервис и какие токены он делает
	По-этому лучше делать всё в папке конфигс что бы сразу в проекте можно было найти где всё хранится

	После того как мы в telegramModule сделали метод forRootAsync -> заинжектили configService и настроили его в в телеграм.конфиг и передали это всё в апп.модуль, то теперь мы можем уже @Inject в наш конструктор опции которые мы передали в конфигСервис

	constructor(
		@Inject(TELEGRAM_MODULE_OPTIONS) options: ITelegramOptions
	) {
		this.bot = new Telegraf(this.options.token);
		this.options = options
	}
	Теперь в сервисе который отвечает за телеграм мы получили по токену конфигурацию которая была получена асинхроно в телеграм конфиге

	1837617000 - id чата, в видео говорили -1001837617000 
*/
