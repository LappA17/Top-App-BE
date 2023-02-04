import { Injectable } from '@nestjs/common';
import { ModelType, DocumentType } from '@typegoose/typegoose/lib/types';
import { Types } from 'mongoose';
import { InjectModel } from 'nestjs-typegoose';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewModel } from './review.model';

@Injectable()
export class ReviewService {
	constructor(@InjectModel(ReviewModel) private readonly reviewModel: ModelType<ReviewModel>) {}

	async create(dto: CreateReviewDto): Promise<DocumentType<ReviewModel>> {
		return this.reviewModel.create(dto);
	}

	async delete(id: string): Promise<DocumentType<ReviewModel> | null> {
		return this.reviewModel.findByIdAndDelete(id).exec();
	}

	async findByProductId(productId: string): Promise<DocumentType<ReviewModel>[]> {
		return this.reviewModel.find({ productId: new Types.ObjectId(productId) }).exec();
	}

	async deleteByProductId(productId: string) {
		return this.reviewModel.deleteMany({ productId: new Types.ObjectId(productId) }).exec();
	}
}

/*
	constructor(@InjectModel(ReviewModel) private readonly reviewModel: ModelType<ReviewModel>) {}
	//здесь мы будем начинать работу с БД
	//что бы работать с БД нам нужна будет модель - ReviewModel
	//что бы иметь к нем доступ нам нужно её заинжектить
	//после этого @Inject(ReviewModel) private readonly reviewModel: ReturnModelType<ReviewModel> у нас будут доступны все методы для работы с моделями
	//сохранения, создания
	//здесь нам нужно Inject сделать модели, что бы она подтянулась как провайдер, в данном случае ReviewModel не подтянится как провайдер и не будет
	//доступен, то-есть делаем InjectModel, а не дефолтный нестовский

	//сначала нам нужно уметь создать новую модель
	//для этого сначала подкорректируем наш контроллер
	//мы должны уметь на основание созаного дто create-review.dto.ts создать запись в БД
	async create(dto: CreateReviewDto): Promise<DocumentType<ReviewModel>> {
		//this.reviewModel. - так мы увидим всё что есть внутри Монгуза
		//create() - создаёт новый документ
		return this.reviewModel.create(dto);
		//в хороших АПИ метод который что-то создаёт должен вернуть полную созданную модель, потому что она будет дополнена к примеру айдишником
		//метод крейт будет нам по умолчанию создавать вот эту модель
	}

	//если мы в возврате фции просто напишем Promise<DocumentType<ReturnModelType>>
	//то что будет если у нас не будет такого айди который мы запрашиваем
	async delete(id: string): Promise<DocumentType<ReviewModel> | null> {
		//метод exec(); выполнит экзекьют
		return this.reviewModel.findByIdAndDelete(id).exec();
	}

	//DocumentType<ReviewModel>[] - потому что find вернёт несколько документов
	async findByProductId(productId: string): Promise<DocumentType<ReviewModel>[]> {
		//findOne - вернет один, find - несколько
		//Types.ObjectId(productId) так мы конвертируем продуктАйди который пришел в аргументах в ObjectId
		return this.reviewModel.find({ productId: new Types.ObjectId(productId) }).exec();
	}

	leaks - мы с имутируем утечку памяти 
	создадим класс Leak
	leaks.push(new Leak());
	при каждом запросе продукта по айди мы будем пушить в leaks новый инстенс этого класса, соотвественно удалятся он не откуда не будет
	запустим прилу npm run start:debug и подключимся с помощью хром дев тулз
	перейдём по этой ссылке brave://inspect/#devices
	у нас в тарегет сразу будет наше приложение
*/
