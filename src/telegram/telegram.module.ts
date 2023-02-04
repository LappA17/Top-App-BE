import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { TELEGRAM_MODULE_OPTIONS } from './telegram.constants';
import { ITelegramModuleAsyncOptions } from './telegram.interface';
import { TelegramService } from './telegram.service';

@Global()
@Module({})
export class TelegramModule {
	static forRootAsync(options: ITelegramModuleAsyncOptions): DynamicModule {
		const asyncOptions = this.createAsyncOptionsProvider(options);
		return {
			module: TelegramModule,
			imports: options.imports,
			providers: [TelegramService, asyncOptions],
			exports: [TelegramService],
		};
	}

	private static createAsyncOptionsProvider(options: ITelegramModuleAsyncOptions): Provider {
		return {
			provide: TELEGRAM_MODULE_OPTIONS,
			useFactory: async (...args: any[]) => {
				const config = await options.useFactory(...args);
				return config;
			},
			inject: options.inject || [],
		};
	}
}

/* exports: [TelegramService] - что бы другие могли использовать TelegramService 

	Если бы мы публиковали наш проект на нмп условно как библиотеку то нам бы кроме forRootaAsync понадобился еще forRoot что бы не асинхроно выполнять конфигруации, а обычныч синхроным кодом куда мы передаём какие-то конфигурации

	По-сути всё то что мы описывали в Декоратора @Module есть в TelegramModule только в TelegramModule мы возвращаем намного большую картину,то-есть мы вернули не просто наш модуль, а мы вернули теже сервисы, импорты и опции(который сейчас будет делать новым методом)

	createAsyncOptionsProvider(options: ITelegramModuleAsyncOptions): Provider мы будем возвращать Провайдер заинжектеным уже useFacdtory опциями и конфигурациями
	Мы должны иметь возможность переиспользовать наши опции в нашем Сервисе, мы должны как-то его там заинжектить

	provide: TELEGRAM_MODULE_OPTIONS - это мы будем провайдить в наш модуль в качестве токена

	в useFactory конфигурацию которую мы расчитаем - мы должны вернуть в качестве значения
	то-есть мы в эти опции ITelegramModuleAsyncOptions передаём некоторую factory которая должна нам вернуть конфиги
	useFactory: async (...args: any[]) => {
		const config = await options.useFactory(...args)
	}
	и эту конфигурацию которую нам вернётся config мы потом будем провайдить по этому токену ТELEGRAM_MODULE_OPTIONS

	const asyncOptions = this.createAsyncOptionsProvider(options) - теперь эти опции не просто константа, а провайдер и мы модем засунуть их в провайдер для того что бы он попал в дерево зависимостей providers: [TelegramService, asyncOptions],
	Мы эти asyncOptions создаем в качестве провайдера что бы потом в любом месте мочь достать их в по этоме токену TELEGRAM_MODULE_OPTIONS
	В рамках этих опций мы делай возврат провайдера через Фектори то-есть мы делаем провайд по токену provide: TELEGRAM_MODULE_OPTIONS
	а в рамках useFactory мы используем фектори которую передали ранее в опциях, и она возвращает нам уже готоые конфиги
	и что бы в этом useFactory мы могли использовать все необходимые нам configService то мы в этот провайдер инжектим необходимые нам зависимости inject: options.inject || []

	@Global() - мы повесим в самом-самом верху Декоратор глобальности - так как мы сделали метод forRoot мы резюмируем что этот метод должен импортировать в корни приложения и распростроняться на всё приложение и что бы не нужно было в других модулях его инжектить - мы сделаем его глобальным, то-есть мы его можем использовать везде без инжекта

	Теперь мы можем спокойно использовать в телеграмКонфиге конфигСервис, потому что весь инжекшен который будет происходить в рамках инициализации модуля - мы уже описали
*/
