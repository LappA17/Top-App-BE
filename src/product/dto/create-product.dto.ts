import { Type } from 'class-transformer';
import { IsNumber, IsString, IsOptional, ValidateNested, IsArray, Max, Min } from 'class-validator';

class ProductCharacteristicDto {
	@IsString()
	name: string;

	@IsString()
	value: string;
}

export class CreateProductDto {
	@IsString()
	image: string;

	@IsString()
	title: string;

	@IsString()
	link: string;

	@Max(5)
	@Min(1)
	@IsNumber()
	initialRating: number;

	@IsNumber()
	price: number;

	@IsOptional()
	@IsNumber()
	oldPrice?: number;

	@IsNumber()
	credit: number;

	@IsString()
	description: string;

	@IsString()
	advantages: string;

	@IsOptional()
	@IsString()
	disAdvantages?: string;

	@IsArray()
	@IsString({ each: true }) //будет проверять что каждый элемент этого массива будет строкой
	categories: string[];

	@IsArray()
	@IsString({ each: true })
	tags: string[];

	@IsArray() //скажчем что внутри characteristics - массив
	@ValidateNested() //что нужно проверить то что внутри(проверить элементы массива)
	@Type(() => ProductCharacteristicDto) //и что элементы массива - это объект типа ProductCharacteristicDto, обрати внимание что Type из class-transformer
	characteristics: ProductCharacteristicDto[];
}
