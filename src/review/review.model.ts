import { prop } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { Types } from 'mongoose';

export interface ReviewModel extends Base {}
export class ReviewModel extends TimeStamps {
	@prop()
	name: string;

	@prop()
	title: string;

	@prop()
	description: string;

	@prop()
	rating: number;

	@prop()
	productId: Types.ObjectId;
}

/*
	//Types - встроенные типы Многуза
	//нам интересует ObjectId что бы когда мы делали лукап в базе данных - мы могли обратится к айди продукту по ObjectId
	@prop()
	productId: Types.ObjectId;
*/
