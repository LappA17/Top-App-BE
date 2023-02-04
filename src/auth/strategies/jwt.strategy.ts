import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserModel } from '../user.model';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(private readonly configService: ConfigService) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: true,
			secretOrKey: configService.get('JWT_SECRET'),
		});
	}

	async validate({ email }: Pick<UserModel, 'email'>) {
		return email;
	}
}

/*
    Чтобы применились параметры наследуемого в класса - в супер нужно передать правильный объект
    Это всё можно найти в описание библиотеки паспорт-jwt

    почему у нас в validate приходит { email }, потому что мы разбераем email в рамках этого payload из сервиса const payload = { email };
    потому что мы зашифровали только email
    мы возвращаем только email потому что всё валидация будет еще на этапе когда он только попадёт в эту стратегию
*/
