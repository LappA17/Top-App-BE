import { prop, index } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';

export class HhData {
	@prop()
	count: number;

	@prop()
	juniorSalary: number;

	@prop()
	middleSalary: number;

	@prop()
	seniorSalary: number;

	@prop()
	updatedAt: Date; //если кто-то редоктирует в админке, то мы б понимали что это обновление всего документа class TopPageModel extends TimeStamps, а когда
	//мы обновляем то понимает что это дата последнего обновления
}

export class TopPageAdvantage {
	@prop()
	title: string;

	@prop()
	desciption: string;
}

export enum TopLevelCategory {
	Courses,
	Services,
	Books,
	Products,
}

export interface TopPageModel extends Base {}
@index({ title: 'text', seoText: 'text' })
export class TopPageModel extends TimeStamps {
	@prop({ enum: TopLevelCategory })
	firstCategory: TopLevelCategory;
	secondCategory: string;

	@prop({ unique: true })
	alias: string;

	@prop({ text: true })
	title: string;

	@prop()
	category: string;

	@prop({ type: () => HhData })
	hh?: HhData;

	@prop({ type: () => [TopPageAdvantage] })
	advantages: TopPageAdvantage[];

	@prop()
	seoText: string;

	@prop()
	tagsTitle: string;

	@prop({ type: () => [String] })
	tags: string[];
}

// advantages: {}[] так мы говорим массив объектов
/*
	export enum TopLevelcategory {
	Courses,
	Services,
	Books,
	Products, //не хорошо называть Продуктами, потому что у нас есть уже такая сущность
}

	//если бы у нас в ключе енама было бы какое-то значения, к примеру: enum TopLevelcategory { Courses = 1 }
	//то нам нужно было бы написать @prop({ enum: TopLevelcategory, type: () => Number }) то-есть у нас из БД будет возвращаться Намбер
	@prop({ enum: TopLevelcategory })
	firstLevelCategory: TopLevelcategory;
	secondCategory: string; //здесь будет: направления, инструменты

	//алиас будет уникальным что бы мы могли вытаскивать уникальное значение по которому будем открывать страницу
	@prop({ unique: true })

	// Представим что нам нужно в поиске(там где search) найти страницу по тексту который будет либо в заголовке либо в описание страницы, нам нужно не попродуктам искать потому что они могут меняться. Для этого мы воспользуемся в Монго текстовыми индексами
	Для этого укажем в prop({ text: true})
	@prop({ text: true }) - таким образом он создаст текстовый индекс над тайтлом

	db.getCollection('TopPage').getIndexes() - если мы в datagrip сейчас пропишем эту команду то мы получим все индексы, а именно: _id, alias(потому что мы в коде прописали что он уникален) и новосозданный Текстовый индекс

	Есть проблема, если мы скажем что нам нужно @prop({ text: true }) над seoText - то при получение индексов db.getCollection('TopPage').getIndexes() у нас ничего не поменяется, потому что тайпгус при проходе создаёт текстовые индексы на основание первого вхождения text, по-этому если нам нужен текстовый индекс по одному полю - мы можем использовать text, а если по нескольким то нужен другой декоратор index

	index добавляем над классом
	и уже в индекс передаём нужные нам поля @index({ title: }) 
	и в тайтл передаем либо 'text' либо 1, если 1чка - обычный индекс, а текст - текстовый индекс на основе title

	Проблема:
	если мы попробуем добавить в модель индексирование advantages, к примеру @index({ title: 'text', seoText: 'text', advantages: 'text'})
	потом в datagrip удалим существующий индекс db.getCollection('TopPage').dropIndex('title_text_seoText_text)
	Перезапустим приложение тем самым убидемся что он создал индекс по трём полям
	потом в инсомнии попробуем найти по слову "описание" страницу
	но он ничего не найдёт !
	Проблема в том что мы не можем навесить текстовы индекс на массив, а avantages - это у нас массив объектов, потому что этот текст не пройдёт в внутрь этого массива объектов и не сможет в этом массиве объектов по каждому свойству пройтись
	Что бы решить эту проблему нужно явно сказать что бы искал это слово в любом поле $** то-есть @index({ '$**': 'text' })
*/
