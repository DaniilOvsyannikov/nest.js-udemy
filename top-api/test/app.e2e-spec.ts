import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { CreateReviewDto } from 'src/review/dto/create-review.dto';
import { Types, disconnect } from 'mongoose';
import { REVIEW_NOT_FOUND } from '../src/review/review.constants';
import { AuthDto } from 'src/auth/dto/auth.dto';
import { USER_NOT_FOUND_ERROR, WRONG_PASSWORD_ERROR } from '../src/auth/auth.constants';

const productId = new Types.ObjectId().toHexString();
const loginDto: AuthDto = {
	login: 'Adam@.com',
	password: '1'
};
const testDto: CreateReviewDto = {
	name: 'Тест',
	title: 'Заголовок',
	discription: 'Описание тестовое',
	rating: 5,
	productId,
};
describe('AppController (e2e)', () => {
	let app: INestApplication;
	let createdId: string;
	let token: string;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();


	});

	it('/login wrong user(POST) - Fail', async () => {
		const wrongUser: AuthDto = {
			login: 'Misha@.com',
			password: '1'
		};
		await request(app.getHttpServer())
			.post('/auth/login')
			.send(wrongUser)
			.expect(401, {
				statusCode: 401,
				error: 'Unauthorized',
				message: USER_NOT_FOUND_ERROR
			});
	})

	it('/login wrong password (POST) - Fail', async () => {
		const wrongUser: AuthDto = {
			login: 'Adam@.com',
			password: '2'
		};
		await request(app.getHttpServer())
			.post('/auth/login')
			.send(wrongUser)
			.expect(401, {
				message: 'Пароль неверный',
				error: 'Unauthorized',
				statusCode: 401
			});
	})

	it('/login (POST) - Success', async () => {
		const { body } = await request(app.getHttpServer())
			.post('/auth/login')
			.send(loginDto)
			.expect(200);
		token = body.access_token;
	})

	it('/review/create (POST) - Success', async () => {
		const { body } = await request(app.getHttpServer())
			.post('/review/create')
			.send(testDto)
			.expect(201);

		createdId = body._id;
		expect(createdId).not.toBeUndefined();
	});


	it('/review/create (POST) - Fail', async () => {
		const { body } = await request(app.getHttpServer())
			.post('/review/create')
			.send({ ...testDto, rating: 0 })
			.expect(400);
	});

	it('/review/byProduct/:productId (GET) - Success', async () => {
		await request(app.getHttpServer())
			.get(`/review/byProduct/${productId}`)
			.expect(200)
			.then(({ body }: request.Response) => {
				expect(body.length).toBe(1);
			})

	});

	it('/review/byProduct/:productId (GET) - Fail', async () => {
		await request(app.getHttpServer())
			.get(`/review/byProduct/${new Types.ObjectId().toHexString()}`)
			.expect(200)
			.then(({ body }: request.Response) => {
				expect(body.length).toBe(0);
			})

	});


	it('/review/:id (DELETE) - Success', async () => {
		await request(app.getHttpServer())
			.delete(`/review/${createdId}`)
			.set('Authorization', 'Bearer ' + token)
			.expect(200);

	});

	it('/review/:id (DELETE) - Fail', async () => {
		await request(app.getHttpServer())
			.delete(`/review/${new Types.ObjectId().toHexString()}`)
			.set('Authorization', 'Bearer ' + token)
			.expect(404, {
				statusCode: 404,
				message: REVIEW_NOT_FOUND
			});

	});

	afterAll(() => {
		disconnect()
	})
});
