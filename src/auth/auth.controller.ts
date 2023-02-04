import { AuthService } from './auth.service';
import {
	Controller,
	HttpCode,
	Post,
	Body,
	UsePipes,
	ValidationPipe,
	BadRequestException,
} from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { ALREADY_REGISTERED_ERROR } from './auth.constants';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@UsePipes(new ValidationPipe())
	@Post('register')
	async register(@Body() dto: AuthDto) {
		const oldUser = await this.authService.findUser(dto.login);
		if (oldUser) {
			throw new BadRequestException(ALREADY_REGISTERED_ERROR);
		}
		return this.authService.createUser(dto);
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('login')
	async login(@Body() { login, password }: AuthDto) {
		const { email } = await this.authService.validateUser(login, password);
		return this.authService.login(email);
	}
}

/*
	class AuthController - у нас авторизация будет только для админов
	@Post над register - декоратор Пост потому что будем передавать в Боди данные
	'register' - это мы передали путь. Название роута и фции рекомендуется соблюдать
	В самом методе регистер нам нужно извлечь body из нашего запроса - воспользуемся дикоратором

	после того как мы auth.service подписали наш accessToken:
	async login(email: string) {
		const payload = { email };
		return {
			accessToken: await this.jwtService.signAsync(payload),
		};
	}
	Теперь мы можем его отдать на Фронт !
*/
