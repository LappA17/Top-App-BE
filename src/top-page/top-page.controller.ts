import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	NotFoundException,
	Param,
	Patch,
	Post,
	UseGuards,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { HhService } from '../hh/hh.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { IdValidationPipe } from '../pipes/ad-validation.pipe';
import { CreateTopPageDto } from './dto/create-top-page.dto';
import { FindTopPageDto } from './dto/find-top-page.dto';
import {
	NOT_FOUND_ALIAS_TOP_PAGE_ERROR,
	NOT_FOUND_TOP_PAGE_BY_TEXT_ERROR,
	NOT_FOUND_TOP_PAGE_ERROR,
} from './top-page.constants';
import { TopPageService } from './top-page.service';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';

@Controller('top-page')
export class TopPageController {
	constructor(
		private readonly topPageService: TopPageService,
		private readonly hhService: HhService,
		private readonly schedulerRegistry: SchedulerRegistry
	) {}

	@UseGuards(JwtAuthGuard)
	@Post('create')
	async create(@Body() dto: CreateTopPageDto) {
		return this.topPageService.create(dto);
	}

	@UseGuards(JwtAuthGuard)
	@Get(':id')
	async get(@Param('id', IdValidationPipe) id: string) {
		const page = await this.topPageService.findById(id);
		if (!page) {
			throw new NotFoundException(NOT_FOUND_TOP_PAGE_ERROR(id));
		}
		return page;
	}

	@Get('byAlias/:alias')
	async getByAlias(@Param('alias') alias: string) {
		const page = await this.topPageService.findByAlias(alias);
		if (!page) {
			throw new NotFoundException(NOT_FOUND_ALIAS_TOP_PAGE_ERROR(alias));
		}
		return page;
	}

	@UseGuards(JwtAuthGuard)
	@Delete(':id')
	async delete(@Param('id') id: string) {
		const detetedPage = await this.topPageService.deleteById(id);
		if (!detetedPage) {
			throw new NotFoundException(NOT_FOUND_TOP_PAGE_ERROR(id));
		}
	}

	@UseGuards(JwtAuthGuard)
	@Patch(':id')
	async patch(@Param('id') id: string, @Body() dto: CreateTopPageDto) {
		const updatedPage = await this.topPageService.updateById(id, dto);
		if (!updatedPage) {
			throw new NotFoundException(NOT_FOUND_TOP_PAGE_ERROR(id));
		}
		return updatedPage;
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('find')
	async find(@Body() dto: FindTopPageDto) {
		return await this.topPageService.findByCategory(dto.firstCategory);
	}

	@Get('textSearch/:text')
	async textSearch(@Param('text') text: string) {
		const pageByText = await this.topPageService.findByText(text);
		if (!pageByText) throw new NotFoundException(NOT_FOUND_TOP_PAGE_BY_TEXT_ERROR(text));
		return pageByText;
	}

	@Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, { name: 'test' }) // мы добавили этот Крон что бы каждую ночь шел запрос по апи для получения актуалДаных
	async test() {
		const job = this.schedulerRegistry.getCronJob('test'); // у job. будет много методов
		//получаем данные всех стрнаиц которые нужно обновить
		const data = await this.topPageService.findForHhUpdate(new Date());
		for (let page of data) {
			const hhData = await this.hhService.getData(page.category);
			page.hh = hhData; //обновляем данные странички на новые hhData
			await this.sleep();
			await this.topPageService.updateById(page._id, page); //передаём обновленую страницу
		}
	}

	//реализуем секундную задержку, что бы по запросу HH возвращалось не всё сразу, а красиво через секунду
	sleep() {
		return new Promise<void>((resolve, reject) => {
			setTimeout(() => {
				resolve();
			}, 1000);
		});
	}
}

/*
	async create(@Body() dto: Omit<TopPageModel, '_id'>) {
		//что бы получить значение из .env файла
		//и за инжектировать сервис конфигураций
	}

	@Get(':id')
	async get(@Param('id') id: string) {
		//параметру id по которому мы что-то получаем
		//this.configService.get('TEST') //так мы получили переменную из .env
	}

	async patch(@Param('id') id: string, @Body() dto: TopPageModel) {
		//нам нужно что бы в body пришла вся модель продукта
	}

	async find(@Body() dto: FindTopPageDto) {
		//поиск тоже будет дто, потому что мы поиск будем создавать по нескольким параметрам
	}

	async find(@Body() dto: FindTopPageDto) - нам вот этот вот файнд необходим что бы правильно формировать меню, по-этому с точки зрения данных - нам вся модель не нужна. По-этому мы модифицируем наш find в Сервисе

*/
