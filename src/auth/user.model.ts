import { prop } from '@typegoose/typegoose';
import { TimeStamps, Base } from '@typegoose/typegoose/lib/defaultClasses';

export interface UserModel extends Base {}

export class UserModel extends TimeStamps {
	@prop({ unique: true })
	email: string;

	@prop()
	passwordHash: string;
}

/*
	export interface AuthModel extends Base {}
	делаем двойное наследование
	мы это можем делать потому что Base не имплементирует никаких функциональностей

	export class AuthModel extends TimeStamps - мы будем модифицировать этот класс что бы сказать typegoose как работать с этой моделью
	//нам нужно иметь айдишник, но кроме этого у монги есть поля с подчеркиванием типа v или t
	//и они хронятс в классе Base, но мы не можем написать в ТС class AuthModel extends TimeStamps, Base

	@prop({ unique: true })
	email: string;
	//мы должны обозначить одно или несколько полей как свойство, которым будет
	//работать эта модель, которое будет класться в базу
	//у нас это будет email и пароль
	//кроме этого мы бы хотели иметь уникальность емейла, для этого в просы передадим доп параметры {}

	//второй хорошой практикой является хранения TimeStamps
	//тоесть когда запись была создана или обновлена
	//createdAt: Date - самый простой способ это сделать
	//но так прийдется делать в каждой модели
	//что бы этого делать - тайпгуус имеет готовый класс, который отвечает за TimeStamps
	//таким образом у нас сразу будут поля createdAt и updatedAt
*/
