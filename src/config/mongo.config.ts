import { ConfigService } from '@nestjs/config';
import { TypegooseModuleOptions } from 'nestjs-typegoose';

const getMongoString = (configService: ConfigService) => {
	return (
		'mongodb://' +
		configService.get('MONGO_LOGIN') +
		':' +
		configService.get('MONGO_PASSWORD') +
		'@' +
		configService.get('MONGO_HOST') +
		':' +
		configService.get('MONGO_PORT') +
		'/' +
		configService.get('MONGO_AUTHDATABASE')
	);
};

const getMongoOptions = () => ({
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

export const getMongoConfig = async (
	configService: ConfigService
): Promise<TypegooseModuleOptions> => {
	return {
		uri: getMongoString(configService),
		...getMongoOptions(),
	};
};

/*
	mongodb://[username:password@]host1[:port1][,...hostN[:portN]][/[defaultauthdb][?options]] вот так выглядит connection string в mongo
	таким образом мы сразу видем параметры которые нам нужно хранить в .env

	configService.get('MONGO_LOGIN') - мы получаем из переменного окружения

	getMongoOptions - тут будут доппараметры при подключение
	useNewUrlParser: true, - будет парсить строку подключения

	getMongoConfig:
	//нам нужно в эту фцию передать configService
	//потому что мы в app.module сделали inject: [ConfigService],

	...getMongoOptions(), благодаря спред опператору мы развернём объект который вернётся из фции getMongoOptions()
	и у нас получится объект 
	{
		uri:  getMongoString(configService),
		useNewUrlParser: true,
		useUnifiedTopology: true
	}
*/
