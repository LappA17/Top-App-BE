import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import { getModelToken } from 'nestjs-typegoose';
import { ReviewService } from './review.service';

describe('ReviewService', () => {
	let service: ReviewService;

	//почему мы объявили exec вверху, а не внутри ?
	//если мы объявим внутри, то при каждом новом find - у нас будет создаваться новый exec, и мы не сможем никак подцепится уже до этого замокканому exec
	//почему exec имеет тип jest.fn() ?
	//jest.fn() - специальный тип, фция в jest которая позволяет нам имулировать, мокать, слушать ту или инную фцию
	//когда мы будем вызывавть exec то мы можем сделать специальные для него listenerы и замокать то что он возвращает
	//как нам замокать вызов exec ?
	const exec = { exec: jest.fn() };

	//мы делаем фцию, которая будет возвращать объект с ключом find
	const reviewRepositoryFactory = () => ({
		//наш find должен вернуть сам объект, и фцию exec
		//потому что this.reviewModel.find({ productId: new Types.ObjectId(productId) }).exec(); здесь происходит чейнинг
		//фция find возвращает нам ревьюмодель, которой мы можем сделать доп фции limit, exec и тд
		//чтобы симулировать это в нашем моковом репозитории нам нужно что бы find возвращал некую фцию exec
		//тогда мы сможем чейнинть find.exec
		find: () => exec,
	});

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				ReviewService,
				{ useFactory: reviewRepositoryFactory, provide: getModelToken('ReviewModel') },
			],
		}).compile();

		service = module.get<ReviewService>(ReviewService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('findByProductId working', async () => {
		//создадим новый id по которому мы будем дёргать наш сервис
		const id = new Types.ObjectId().toHexString();
		//а так мы получим в теории наш паттерн, мы у репозитория делаем файнд потом exec
		//но exec мы должны на сей раз замокать, потому что мы не будем обращаться к реальной базе данных
		//exec. мы увидим что jest.fn имеет кучу возможностей
		//нам нужно mockReturnValueOnce что бы мы один раз вернули что-то из exec
		//наш findByProductId возвращает Promise<DocumentType<ReviewModel>[]>
		//что бы не генерировать всю модель, сгенерируем только продукт
		reviewRepositoryFactory()
			.find()
			.exec.mockReturnValueOnce([{ productId: id }]);
		const res = await service.findByProductId(id);
		expect(res[0].productId).toBe(id);
		//то-есть сейчас мы делаем мок того что возвращает нам база и сравнения что база нам это вернула
	});
});

/*
  По умолчанию у нас уже был создан этот файл spec 
  Если мы его сейчас запустим npm run test - потому что unit тест, то выдаст ошибку
  потому что ReviewModelModel - провайдер который нигде не объявлен
  Если мы зайдем в review.service то увидим constructor(@InjectModel(ReviewModel) private readonly reviewModel: ModelType<ReviewModel>) {}
  то-есть наш @InjectModel(ReviewModel) отсутсвтует в спеке
  Что бы успешно запустить этот тест - нам нужно успешно передать все зависимости в review.service,
  но мы не можем просто взять и за инжектить модель, потому что мы собираем модель только с одним review.service и у нас не доступен не typegoose модуль, не конфиг модуль и не какие другие модули из которых состоит все приложение
  по-этому нам прийдется это Мокать ! 

  providers: [ReviewService], мы будем в провайдере мокать необходимые зависимости
  просто написать providers: [ReviewService, ReviewModel] мы не можем, потому что ReviewModel просто нет в тайпгузе
  по-этому мы будем использовать фектори - который будет возвращать нам некоторый моковый объект этой модели

  reviewRepositoryFactory - будет просто фцией, которая будет возвращать доп фции, что бы наш review сервис смог ими пользоваться

  provide - в провайд мы должны провайдить какой-то токен
  provide: getModelToken - это фция тайпгуза, которая получит токен указанной модели, а модель передаём как строку - ReviewModel
  provide: getModelToken('ReviewModel') - тем самым говорим что бы нам нашли ревьюмодель в зависимостях, найди ее токен и по нему заинжекти новую фабрику
*/
