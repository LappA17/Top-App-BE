import { IsNumber, IsString, Max, Min } from 'class-validator';

export class CreateReviewDto {
	@IsString()
	name: string;

	@IsString()
	title: string;

	@IsString()
	description: string;

	@Max(5)
	@Min(1, { message: 'Нельзя поставить рейтинг меньше 1' })
	@IsNumber()
	rating: number;

	@IsString()
	productId: string;
}

/*
	max и min над рейтингом - рейтинг можетбыть от 1-5

	productId: string; //мы ObjectId на фронте не будем конвертировать в Types.ObjectId, это будет просто строка

	rating must not be less than 1 - это дефолтное поле ошибки, мы его можем модифицировать передав вторым аргументво объект с полем message

*/
