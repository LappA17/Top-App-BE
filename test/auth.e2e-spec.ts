import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { AuthDto } from '../src/auth/dto/auth.dto';
import * as request from 'supertest';
import { disconnect } from 'mongoose';

const loginDto: AuthDto = {
	login: 'ruslan@gmail.com',
	password: 'ruslan',
};

describe('AuthController (e2e)', () => {
	let app: INestApplication;
	let token: string;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();

		const { body } = await request(app.getHttpServer()).post('/auth/login').send(loginDto);
		token = body.access_token;
	});

	it('/auth/login (POST) - success', async () => {
		return request(app.getHttpServer())
			.post('/auth/login')
			.send(loginDto)
			.expect(200)
			.then(({ body }: request.Response) => {
				expect(body.access_token).toBe(token);
			});
	});

	it('/auth/login (POST) - failed', () => {
		return (
			request(app.getHttpServer())
				.post('/auth/login')
				//поменяем поля пароля
				.send({ ...loginDto, password: '0' })
				.expect(401)
		);
	});

	it('/auth/login (POST) - failed', () => {
		return (
			request(app.getHttpServer())
				.post('/auth/login')
				//поменяем поля логина
				.send({ ...loginDto, login: '0' })
				.expect(401)
		);
	});

	afterAll(() => {
		disconnect();
	});
});
