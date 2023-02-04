import { IsString, IsNumber } from 'class-validator';

export class FindProductDto {
	@IsString()
	category: string;
	@IsNumber()
	limit: number;
}

/*
	category: string; //по категории которую нужно найти
	limit: number; //сколько хотим получить этих продуктов
*/
