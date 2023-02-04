import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { AuthController } from './auth.controller';
import { UserModel } from './user.model';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getJWTConfig } from '../config/jwt.config';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
	controllers: [AuthController],
	imports: [
		TypegooseModule.forFeature([
			{
				typegooseClass: UserModel,
				schemaOptions: {
					collection: 'User',
				},
			},
		]),
		ConfigModule,
		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: getJWTConfig,
		}),
		PassportModule,
	],
	providers: [AuthService, JwtStrategy],
})
export class AuthModule {}

/*
	//сейчас мы начнём подключать описанные ранее модели к БД посредством typegoose, то-есть навешиать декораторы что бы typegoose смог понять как с этими моделями работать в БД. Во-первых нам нужно объявить модель, которая будет использоваться в том или инном модуле, конкретно typegoose и какой схеме она будет отвечать
	imports: [
		//для этого используем TypegooseModule.forFeature() где мы уже будем передавать информацию о моделях, которые будем использовать
		TypegooseModule.forFeature([
			{
				//здесь будет модель авторизации
				typegooseClass: AuthModel,
				schemaOptions: {
					//это будут доп опции схемы, у нас это будет коллекция - какая коллекция будет использоваться для хранения данных этой модели
					collection: 'Auth',
				},
			},
		]),
	],

	providers: [AuthService, JwtStrategy], так как эта стратегий представлена провайдером должна быть и в нашем модуле

	из-за того что мы в jwt.strategy используем ConfigService - нам нужно не забыть импортировать сюда ConfigModule из которого как раз виден configService
	не смотря на то что мы импортировали его во внутрь JwtModule при registerAsync, в реальности он будет доступен только внутри вот этой вот регистрации модулей:
	JwtModule.registerAsync({
		imports: [ConfigModule],
		inject: [ConfigService],
		useFactory: getJWTConfig,
	})
	и по-этому в нашей стратегии мы его не увидем, и его нужно импортировать в модуль авторизации
*/
