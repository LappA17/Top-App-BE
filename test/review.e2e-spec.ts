import { REVIEW_NOT_FOUND } from './../src/review/review.constants';
import { CreateReviewDto } from './../src/review/dto/create-review.dto';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Types, disconnect } from 'mongoose';
import { AuthDto } from 'src/auth/dto/auth.dto';

const productId = new Types.ObjectId().toHexString(); //toHexString() - что бы передать строкой

//захардкодим пользователя
const loginDto: AuthDto = {
	login: 'ruslan@gmai.com',
	password: 'ruslan',
};

//замокаем объект, который мы будем передавать
const testDto: CreateReviewDto = {
	name: 'Тест',
	title: 'Заголовок',
	description: 'Описание тестовое',
	rating: 5,
	productId,
};

//дескрайб описывает группу тестов
describe('AppController (e2e)', () => {
	let app: INestApplication; //это будет наше целое приложение, которое будет инициализироваться
	//здесь мы будем сохранять айдишник, что бы потом по нему удалять
	let createdId: string;
	let token: string;

	//перед каждый it будет выполнятся beforeEach
	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();

		//так мы залогинимся и send отправит наш пейлод(лог и пароль). И в body и будет accessToken
		const { body } = await request(app.getHttpServer()).post('/auth/login').send(loginDto);
		token = body.access_token;
	});

	//описывает конкретный тест
	it('/review/create (POST) - success', async () => {
		return request(app.getHttpServer())
			.post('/review/create')
			.send(testDto)
			.expect(201)
			.then(({ body }: request.Response) => {
				createdId = body._id;
				expect(createdId).toBeDefined();
			});
	});

	it('/review/create (POST) - failed', () => {
		return (
			request(app.getHttpServer())
				.post('/review/create')
				//так мы перезаписали поле объкта, не смотря на то что мы сделали спред-опператор у нас уже существует поле rating, и мы его с 5 перезаписал в 0 !!!
				.send({ ...testDto, rating: 0 })
				.expect(400) //неверные данные
		);
	});

	it('/review/create (POST) - failed', async () => {
		return request(app.getHttpServer())
			.post('/review/create')
			.send({ ...testDto, rating: 0 })
			.expect(400)
			.then(({ body }: request.Response) => {
				/*
					 console.log(body);
					 {
						statusCode: 400,
						message: [ 'rating must not be less than 1' ],
						error: 'Bad Request'
					}
				*/
			});
	});

	it('/review/byProduct/:productId (GET) - success', async () => {
		return request(app.getHttpServer())
			.get('/review/byProduct/' + productId)
			.expect(200)
			.then(({ body }: request.Response) => {
				//тут мы ожидаем что нам вернется отзывы продукта
				//отзывы будут в виде массива, и просто првоверим что хотя бы один элемент будет в массиве
				expect(body.length).toBe(1);
			});
	});

	//будем проверять если нет какого-то продукта, то обработать ошибку
	it('/review/byProduct/:productId (GET) - failed', async () => {
		return request(app.getHttpServer())
			.get('/review/byProduct/' + new Types.ObjectId().toHexString())
			.expect(200)
			.then(({ body }: request.Response) => {
				expect(body.length).toBe(0);
			});
	});

	//из-за того что мы навесили над delete мидлвеер декорато @UseGuards(JwtAuthGuard) в review.controller
	//то нам нужно установить Хедеры с помощью set
	it('/review/:id (DELETE) - success', () => {
		return request(app.getHttpServer())
			.delete('/review/' + createdId)
			.set('Content-Type', 'application/json')
			.set('Authorization', `Bearer: ${token}`)
			.then(() => {
				expect(200);
			});
	});

	it('/review/:id (DELETE) - fail', () => {
		return (
			request(app.getHttpServer())
				.delete('/review/' + new Types.ObjectId().toHexString())
				.set('Content-Type', 'application/json')
				.set('Authorization', `Bearer: ${token}`)
				//первым аргументом передаём статус код который мы ожидаем получить, вторым объект
				.then(() => {
					expect({
						statusCode: 404,
						message: REVIEW_NOT_FOUND,
					});
				})
		);
	});

	//почистит все конекшены которые остались, к примеру подключение к БД
	afterAll(() => {
		disconnect();
	});
});
//toBeDefined-чтобы он был задан, если он не прийдет значит есть ошибка
