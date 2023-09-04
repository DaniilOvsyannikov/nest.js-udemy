import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { CreateReviewDto } from 'src/review/dto/create-review.dto';
import { Types, disconnect } from 'mongoose';

const productId = new Types.ObjectId().toHexString();
const testDto: CreateReviewDto = {
	name: 'Тест',
	title: 'Заголовок',
	discription: 'Описание тестовое',
	rating: 5,
	productId,
}
describe('AppController (e2e)', () => {
	let app: INestApplication;
	let createdId: string;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();
	});

	it('/review/create (POST)', async () => {
		const { body } = await request(app.getHttpServer())
			.post('/review/create')
			.send(testDto)
			.expect(201);

		createdId = body._id;
		expect(createdId).not.toBeUndefined();
	});

	it('/review/:id (DELETE)', async () => {
		const { body } = await request(app.getHttpServer())
			.delete(`/review/${createdId}`)
			.expect(200);

		console.log(body);
	});

	afterAll(() => {
		disconnect()
	})
});
