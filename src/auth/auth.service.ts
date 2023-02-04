import { UserModel } from './user.model';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { genSalt, genSaltSync, hash, hashSync, compare } from 'bcryptjs';
import { USER_NOT_FOUND_ERROR, WRONG_PASSWORD_ERROR } from './auth.constants';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
	constructor(
		@InjectModel(UserModel) private readonly userModel: ModelType<UserModel>,
		private readonly jwtService: JwtService
	) {}

	async createUser(dto: AuthDto) {
		const salt = await genSalt(10);
		const newUser = new this.userModel({
			email: dto.login,
			passwordHash: await hash(dto.password, salt),
		});
		return newUser.save();
	}

	async findUser(email: string) {
		return this.userModel.findOne({ email }).exec();
	}

	async validateUser(email: string, password: string): Promise<Pick<UserModel, 'email'>> {
		const user = await this.findUser(email);
		if (!user) {
			throw new UnauthorizedException(USER_NOT_FOUND_ERROR(email));
		}
		const isCorrectPassword = await compare(password, user.passwordHash);
		if (!isCorrectPassword) {
			throw new UnauthorizedException(WRONG_PASSWORD_ERROR);
		}
		return {
			email: user.email,
		};
	}

	async login(email: string) {
		const payload = { email };
		return {
			accessToken: await this.jwtService.signAsync(payload),
		};
	}
}

/*
    Мы вв конструкторе делаем @InjectModel(UserModel) что бы у нас была зависимость

    Нам нужна библиотека bcryptjs что бы шифровать пароли, а потом сравнивать их

    salt - соль, это то что мы подмешиваем для шифрования пользователя

    Нам нужно сохранить пользователя в БД
    Если раньше мы создавали review - который берёд наши данные, создаёт модель и кладёт в БД
    async create(dto: CreateReviewDto): Promise<DocumentType<ReviewModel>> {
		return this.reviewModel.create(dto);
	}
    То здесь мы так сделать не может, потому что не хоти хранить наш пароль в открытом виде в бд
    по-этому перед тем как сохранить - нам нужно создать инстенс новой модели
    passwordHash: hashSync(dto.passwrod, salt) - метод hashSync - хеширует пароль с той солью что мы передали ранее
    newUser.save() - сохраняет юзера в БД

	const isCorrectPassword = await compare(password, user.passwordHash) - фция compare принимает первым параметром пароль который будет сравнивать и вторым это hash с которым будет сравнивать

	login будет возвращать нам нужный аксестокен

	//JWT стратегия и Guard нужно что бы по проверки токена мы пускали или не впускали, на тот или инной роут
	что бы работать со стратегией нам нужно установить библиотеку пасспорт
	если мы зайдём на сайт пасспорта, то увидем что у нас есть кучу стратегий которые нам помогут авторизоваться: гугл, фейсбук,http bearer и так далее, нам нужна пасспорт jwt
*/
