import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.setGlobalPrefix('api'); //все запросы к апи должны иметь в url /api
	await app.listen(8000);
}
bootstrap();
