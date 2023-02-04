import { IsString } from 'class-validator';

export class AuthDto {
	@IsString()
	login: string;

	@IsString()
	password: string;
}

//у нас логин и пароль принимают одинаковые данные - логин и пароль
//по-этому мы создадим один файл auth.dto.ts
