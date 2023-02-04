import { prop } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';

class ProductCharacteristic {
	@prop()
	name: string;

	@prop()
	value: string;
}

export interface ProductModel extends Base {}
export class ProductModel extends TimeStamps {
	@prop()
	image: string;

	@prop()
	title: string;

	@prop()
	link: string;

	@prop()
	initialRating: number;

	@prop()
	price: number;

	@prop()
	oldPrice?: number;

	@prop()
	credit: number;

	@prop()
	description: string;

	@prop()
	advantages: string;

	@prop()
	disAdvantages?: string;

	@prop({ type: () => [String] })
	categories: string[];

	@prop({ type: () => [String] })
	tags: string[];

	@prop({ type: () => [ProductCharacteristic], _id: false })
	characteristics: ProductCharacteristic[];
}
// [key: string]: string;так мы говорим что мы получаем неограниченное число ключей в объекте типа стринг и значений стринг

/*
	@prop()-это просто будет свойство без всяких параметров, то-есть все простые типы(стринг,намбер,дейт) он будет сам понимать без доп указания типов

	//что бы обозначить typegoose что это массив - нам нужно явно указать типы
	@prop({ type: () => [String] }) //так мы сказали что в категориях всегда будет массив строк

	//_id: false - так мы обозначали что на айдишник для каждого элемента массива характеристик не нужен
	@prop({ type: () => [ProductCharacteristic], _id: false })
	characteristics: ProductCharacteristic[];

	[Nest] 45471  - 15.10.2022, 14:15:01   ERROR [ExceptionsHandler] Cast to ObjectId failed for value "find" (type string) at path "_id" for model "ProductModel"
У нас есть такая ошибка, к примеру мы делаем запрос на обновление продукта на айдишник не которого не существует, а айдишник который не подходит подObjectId
	CastError: Cast to ObjectId failed for value "find" (type string) at path "_id" for model "ProductModel"
	Потому что он попытается костануть значение которое мы преслали к ObjectId что бы найти по продукту, и не сможет по приччине того что наш этот айдшиник не будет Монговским айдишником. По-этому мы напишем доп пайп который позволит нам валидировать в любым местах полученные айдишники
*/
