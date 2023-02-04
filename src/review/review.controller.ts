import {
	Body,
	Controller,
	Delete,
	Get,
	HttpException,
	HttpStatus,
	Param,
	Post,
	UseGuards,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { IdValidationPipe } from 'src/pipes/ad-validation.pipe';
import { TelegramService } from 'src/telegram/telegram.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { userEmail } from '../decorators/user-email.decorator';
import { CreateReviewDto } from './dto/create-review.dto';
import { REVIEW_NOT_FOUND } from './review.constants';
import { ReviewService } from './review.service';

@Controller('review')
export class ReviewController {
	constructor(
		private readonly reviewService: ReviewService,
		private readonly telegramService: TelegramService
	) {}

	@UsePipes(new ValidationPipe())
	@Post('create')
	async create(@Body() dto: CreateReviewDto) {
		return this.reviewService.create(dto);
	}

	@UsePipes(new ValidationPipe())
	@Post('notify')
	async notify(@Body() dto: CreateReviewDto) {
		const message =
			`Имя: ${dto.name} \n` +
			`Заголовок: ${dto.title}\n` +
			`Описание: ${dto.description}\n` +
			`Рейтинг: ${dto.rating}\n` +
			`Айди Продукта: ${dto.productId}`;
		return this.telegramService.sendMessage(message);
	}

	@UseGuards(JwtAuthGuard)
	@Delete(':id')
	async delete(@Param('id', IdValidationPipe) id: string) {
		const deletedDoc = await this.reviewService.delete(id);
		if (!deletedDoc) {
			throw new HttpException(REVIEW_NOT_FOUND, HttpStatus.NOT_FOUND);
		}
	}

	@Get('byProduct/:productId')
	async getByProduct(
		@Param('productId', IdValidationPipe) productId: string,
		@userEmail() email: string
	) {
		return this.reviewService.findByProductId(productId);
	}
}

/*
	@UsePipes(new ValidationPipe()) - когда у нас прийдет body ниже, то он будет автоматически провалидировал теми import { IsNumber, IsString, Max, Min from 'class-validator'; в нашей dto

	В методе delete если ошибки не будет то по умолчанию вернёт 200, по-этому нет проверки на if (deletedDoc)
	В if(!deletedDoc) первый параметр - строка с ошибкой, второй хттп статус HttpStatus. - их тут много
	так мы получим 404 с текстом передаваемым в первый аргумент

	создадим метод create потому что ревью не обновляется а один раз поститься

	constructor: так как reviewService подключен в модуль - мы получим в контроллере его инстенс !

	Теперь наш гард будет защищать наш роут от несанкционированного поиска
	@UseGuards(JwtAuthGuard)
	@Get('byProduct/:productId')
	async getByProduct(@Param('productId') productId: string) {
		return this.reviewService.findByProductId(productId);
	}

	async getByProduct(@Param('productId') productId: string, @userEmail() email: string) {
		console.log(email);
	То с помощью нашего декоратора который мы создали своими руками, после того как мы в инсомние сделаем гетзапрос к продуктам и укажем в Authorization Bearer и тут какой-то jwt-токен, то мы в консоль получим емейл нашего пользователя
*/
