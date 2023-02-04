import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

export const getJWTConfig = async (configService: ConfigService): Promise<JwtModuleOptions> => {
	return {
		secret: configService.get('JWT_SECRET'),
	};
};
/*
    Здесь мы напишем фция, которая будет позволять получать наш конфиг

    configService - мы будем использовать конфигСервис для чтения токена
*/
