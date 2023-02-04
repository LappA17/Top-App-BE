import { Injectable } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { addDays } from 'date-fns';
import { Types } from 'mongoose';
import { InjectModel } from 'nestjs-typegoose';
import { CreateTopPageDto } from './dto/create-top-page.dto';
import { TopLevelCategory, TopPageModel } from './top-page.model';

@Injectable()
export class TopPageService {
	constructor(
		@InjectModel(TopPageModel) private readonly topPageModel: ModelType<TopPageModel>
	) {}

	async create(dto: CreateTopPageDto) {
		return this.topPageModel.create(dto);
	}

	async findById(id: string) {
		return this.topPageModel.findById(id).exec();
	}

	async findByAlias(alias: string) {
		return this.topPageModel.findOne({ alias }).exec();
	}

	async findAll() {
		return this.topPageModel.find({}).exec();
	}

	async findByCategory(firstCategory: TopLevelCategory) {
		return this.topPageModel
			.aggregate()
			.match({
				firstCategory,
			})
			.group({
				_id: { secondCategory: '$secondCategory' },
				pages: {
					$push: { alias: '$alias', title: '$title', _id: '$_id', category: '$category' },
				},
			})
			.exec();
	}

	async findByText(text: string) {
		return this.topPageModel.find({ $text: { $search: text, $caseSensitive: false } }).exec();
	}

	async deleteById(id: string) {
		return this.topPageModel.findByIdAndRemove(id).exec();
	}

	async updateById(id: string | Types.ObjectId, dto: CreateTopPageDto | any) {
		return this.topPageModel.findByIdAndUpdate(id, dto, { new: true }).exec();
	}

	async findForHhUpdate(date: Date) {
		return this.topPageModel
			.find({
				firstCategory: 0,
				$or: [
					{ 'hh.updatedAt': { $lt: addDays(date, -1) } },
					{ 'hh.updatedAt': { $exists: false } },
				],
			})
			.exec();
	}
}

/*
    findByCategory - нам агригация в целом не нужна, потому что нам ничего не нужно подтягивать, не список продуктов, ничего. Мы просто будем получать список страниц по топ-левел категориям
    return this.topPageModel.find({ firstCategory }); - потому что может быть много страниц который попадают под одну и туже категорию
    Вторым параметром find принимает список полей, которые нам нужны для того что бы передать дальше. По-этому мы можем ограничить поля к примеру алиасом
    alias: 1 - 1чка означает что это поле будет. Так же нам понадобится вторая категория и заголовок
    findByCategory теперь имеет ограниченные поля и будет возвращать только часть модели

    this.topPageModel.find({ $text: {}}) - мы осуществляем поиск по тексту среди индексированных полей в @index({ title: 'text', seoText: 'text' })
    @search - это то что мы ищем, а мы ищем по 'text' а не 1
    caseSensative: false что бы мочь и в аппер и лоуеркейсе писать, то-есть без разницы

    Нам нужно модифицировать этот поиск return this.topPageModel.find({ $text: { $search: text, $caseSensitive: false } }).exec(); так что бы была правильная вложенность. То-есть у нас есть 3 вложенности: 1-курсы 2-дизайн, разработка, аналитика, маркетинг 3-в дизайне у нас фигма, илюстратор и тл, в разработке будут уже свои поля
    Нам нужно модифицировать так что бы выдавать вложения: то-есть firstCateogry: 1,  а в ней secondCategory: 'Разработка' и в ней уже будет массив страничек
    заменим find на aggregate

    @match: firstCategory - потому что мы ищем по категориям, у нас на этом этапе вернется весь пост по категории

    @group - позволяет сгруппировать наши строки выдаваемых таблиц по какому-то критерию
    в группе нужно задавать _id - это и есть айди по которому мы будем группировать
    $group: {
        _id: { secondCategory: '$secondCategory'}
    }
    на этом этапе мы уже получим массив в рамках которого будет категория, к примеру разработка, пока что это безполезно потому что нам нужно получить набор страниц которые находятся внутри - для этого передадим второе поле @pages
    в $pages нам нужно уже $push сделать страниц !
    $push: { alias: '$alias'} - нам нужен алиас что бы правильно вытащить страницу чтобы потом правильно перейти по ней
    @title вытаскиваем что бы правильно отобразить его в меню

    Есть два способа писать агригацию
    1) способ писать передавая в массив агригации объекты $mathc, $group и тд
    .aggregate([
        {
            $match: { firstCategory },
        },
        {
            $group: {
                _id: { secondCategory: '$secondCategory' },
                $pages: {
                    $push: { alias: '$alias', title: '$title' },
                },
            },
        },
    ])
    2) способ черещ точку как chainable 
    return this.topPageModel
        .aggregate()
        .match({
            firstCategory
        })
        .group({
            _id: { secondCategory: '$secondCategory' },
            pages: { $push: { alias: '$alias', title: '$title', _id: '$_id', category: '$category' } }
        }).exec();


    findAll эта команда нам позволит вытащить нам все записи
    У нас страниц может быть 1-2 тысячи и на производительности это некак не сказывается
    find({}) с пустым объектом вернёт нам все страницы что у нас есть и дальше мы будем приобразоыывать их в xml

    findForHhUpdate - нам в этом методе нужно найти все даты обновления, старше чем день назад
    firstCategory: 0 - в find мы передаём объект опций для поиска - нам нужно исктаь только по Курсам, а это TopLevelCategory -> Courses, а курсы это 0 индекс в этом енаме

    'hh.updatedAt' - таким образом мы обращаемся к вложенному образу 
    $lt - оппертор меньше в Монге, $gt - больше

    'hh.updatedAt': { $lt: addDays(date, -1) }, у нас этого hh.updatedAt может не быть
    У нас может быть либо мы никогда не обновляли, либо обновление было
    передадим оппертора $or - опператор условий
    { 'hh.updatedAt': { $exists: false } } - это условие что exists: false -  не существует
*/
