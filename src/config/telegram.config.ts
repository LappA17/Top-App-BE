import { ConfigService } from '@nestjs/config';
import { ITelegramOptions } from 'src/telegram/telegram.interface';

export const getTelegramConfig = (configService: ConfigService): ITelegramOptions => {
	const token = configService.get('TELEGRAM_TOKEN');
	if (!token) {
		throw new Error('TELEGRAM_TOKEN не задан');
	}
	return {
		token,
		chatId: configService.get('CHAT_ID') ?? '',
	};
};

/*
    Если мы будем делать ТелеграмКонфиг по аналогии с другими конфигами, то нам нужно иметь configService
    То-есть мы делаем const configService = new ConfigService() и начинаем с ним работать
    Но это не очень правильно ! Мы ломаем концепцию dependecy injection, в результате мы получаем некий второй инстенс configService и если у нас где-то в конфигах будет замена какого-то значения, то у нас один инстенс configService не будет об этом знать
    По-этому в дальнейшем мы сделаем такой же метод forRoot.async() у нашего телеграм.модуля, как тот же метод у нас сейчас
    присутствует у TypegooseModule
    TypegooseModule.forRootAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: getMongoConfig,
    })
    где мы импортируем ConfigModule, делаем inject ConfigService и используем его в factory
*/
