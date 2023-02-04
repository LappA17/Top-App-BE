import { Injectable } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { CreateProductDto } from './dto/create-product.dto';
import { FindProductDto } from './dto/find-product.dto';
import { ProductModel } from './product.model';

@Injectable()
export class ProductService {
	constructor(
		@InjectModel(ProductModel) private readonly productModel: ModelType<ProductModel>
	) {}

	async create(dto: CreateProductDto) {
		return this.productModel.create(dto);
	}

	async findById(id: string) {
		return this.productModel.findById(id).exec();
	}

	async deleteById(id: string) {
		return this.productModel.findByIdAndDelete(id).exec();
	}

	async updateById(id: string, dto: CreateProductDto) {
		return this.productModel.findByIdAndUpdate(id, dto, { new: true }).exec();
	}

	async findWithReviews(dto: FindProductDto) {
		return this.productModel
			.aggregate([
				{
					$match: {
						categories: dto.category,
					},
				},
				{
					$sort: {
						_id: 1,
					},
				},
				{
					$limit: dto.limit,
				},
				{
					$lookup: {
						from: 'Review',
						localField: '_id',
						foreignField: 'productId',
						as: 'reviews',
					},
				},
				{
					$addFields: {
						reviewCount: { $size: '$reviews' },
						reviewAvg: { $avg: '$reviews.rating' },
						//перезаписываем существующие поле с помощью фции
						reviews: {
							$function: {
								body: `function (reviews) {
									reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
									return reviews;
								}`,
								args: ['$reviews'],
								lang: 'js',
							},
						},
					},
				},
			])
			.exec();
	}
}

/*
    В Сервисе сразу заинжектим модель для работы с БД

    у findByIdAndUpdate() есть опционально третий параметр
    по умолчанию все фции которые есть у модели монго(update, findByIdAndUpdate и тд) - они возвращают предыдущую версию документа
    но нам нужно обновить данные на фронте, которые пришли с бека
    по-этом нам нужно передать объект доп опций {new: true} который вернёт всегда новый объект 

    Теперь перейдём к аргригации - она будет полезна когда мы к примеру будет хотеть к одной таблице подтянуть данные из другой таблици
    Мы это конечно можем делать в js - дёргая одну find, потом другую, слить и выдать,  но для больших и сложных запросов ВСЕГДА лучше выполнять
    в БД - так будет производительней

    aggregate
    В аргригации Монго, есть пайплайны - это набор последовательных шагов, которые так же будут исполнены в БД, которые в результате выдадут нам финальную модель
    Мы берём БД и туда передаём шаги с описанием того что они будут делать и на выходе получаем сагрегируемымые каким-то образом данные

    match - будет сравнивать какое-то значение в JSON документов Монги, с нашим значением
    у нас у модели есть свойство categories и мы будем их сравнивать
    Нужно не смущать что categories у нам массив, в такой записе categories: dto.category если у нас в массиве categories хотя бы одно значение как dto.category то он его выберет. Тем самым мы уже нашли во всём нашем документе продуктов  документ который содержит данную категорию

    В limit мы передаём сколько всего мы хотим отсортировать документов
    У Монги есть такое понятие как стабильная и нестабильная сортировка - по умолчанию монга когда будет делать агригацию - может в себе менять сортировку, по-этому лимит(к примеру если у нас лимит = 5) часто может выдавать разны значения, а нам это не нужно. Сортировка - должна быть стабильной
    Стабильная сортировка - это сортировка по какому-та единному айдишнику, сортировка по айди - стабильна
    Перед лимитом всегда лучше отсортировать документы

    lookup - должен подтянуть одну табличку к другой
    from - говорит откуда(с какой таблицы) мы должны подтянуть данные
    localField - локально обозначаем поле, которое мы хотим использовать для поиска localField: '_id', потому что у нас в review есть productId, соотвественно foreignField - поле в котором мы будем искать и будет productId
    as: 'review' - так мы задали алиас для поля которое будет выведенно в результате

    addFields - пайлайн, который позволяет добавть поля, на основание фций(каких-то расчётов)
    reviewCount: { $size: ''} - число ревью полей будет равно всей длине массива
    Теперь нам нужно внутри пайплайна сослаться на переменную из предыдущего документа, мы в рамках предыдущего документа получили новое поле review(as: 'review') в корне этого документа - по-этому через $review мы можем использовать ссылку на это поле тем самым мы явно указали что мы ссылаемся на поле ревью
    reviewAvg - здесь будем считать среднbq рейтинг ревью. $avg - опператор, который дает возможность получить среднее. $review.rating - мы ссылаемся на review и у него точно так же как и в js берём рейтинг

    as в конце используем as чтобы костануть возвоащаемую из агригации массив к какому-то типу
    ProductModel - у продуктмодели появились новые свойства - review, review count и review avg
    по-этому можем сказать что мы возрващаем смешанный тип между ProductModel и {}
    review: ReviewModel[] - потому что мы возвращаем массив ревьюшек когда делаем lookup
    .exec() as (ProductModel & {
    review: ReviewModel[],
    reviewCount: number,
    reviewAvg: number,})[]; и в конце поставим [] потому что возвращается массив моделей

	function
	фцией мы перезапимываем reviews 
	она обязательно должна принимать три параметра: тело фции, массив аргументов и язык на котором пишем
	в массив аргументов передаем reviews потому что мы хотим эти ревью переструктурировать(изменить)
	мы сортируем ревью от самых новых до самых старых reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
	и так как нам нужно вернуть теже reviews только уже отсортированные то пишем return reviews
*/
