import { Controller, Get, Header } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TopPageService } from 'src/top-page/top-page.service';
import { subDays, format } from 'date-fns';
import { Builder } from 'xml2js';
import { CATEGORY_URL } from './sitemap.constants';

@Controller('sitemap')
export class SitemapController {
	domain: string;

	constructor(
		private readonly topPageService: TopPageService,
		private readonly configService: ConfigService
	) {
		this.domain = this.configService.get('DOMAIN') ?? '';
	}

	@Get('xml')
	@Header('content-type', 'text/xml')
	async sitemap() {
		const formatString = "yyyy-MM-dd'T'HH:mm:00.000xxx";
		let res = [
			{
				loc: this.domain,
				lastmod: format(subDays(new Date(), 1), formatString),
				changefreq: 'daily',
				priority: '1.0',
			},
			{
				loc: `${this.domain}/courses`,
				lastmod: format(subDays(new Date(), 1), formatString),
				changefreq: 'daily',
				priority: '1.0',
			},
		];
		const pages = await this.topPageService.findAll();
		res = res.concat(
			pages.map(page => {
				return {
					loc: `${this.domain}${CATEGORY_URL[page.firstCategory]}/${page.alias}`,
					lastmod: format(new Date(page.updatedAt ?? new Date()), formatString),
					changefreq: 'weekly',
					priority: '0.7',
				};
			})
		);
		const builder = new Builder({
			xmldec: { version: '1.0', encoding: 'UTF-8' },
		});
		return builder.buildObject({
			urlset: {
				$: {
					xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9',
				},
				url: res,
			},
		});
	}
}

/* Мы разберём как генерить xml карту сайта, которая будет распологаться по адресу sitemap.xml. По-этому сайтМепу индексируются роботы поисковики - это     некая инструкция которая говорит поисковикам как находить наш сайт

  urlset - это массив юрлов, которые должен пройти поисковик
  в каждом url - куда ему идти
  lastmod - ластмодифайд, когда последний раз он был изменён
  changefreq - чистота изменения, к примеру weekly, daily, благодаря этому робот понимает как часто обходить
  priority - у каждого робота который обходит сайт есть какая-то квота, которую он на него выделяет, к примеру: 0.7, 1.0. Если у нас много страниц, то в индексе будут те страницы которые с более высоким приоритетом

  Вторая особенность xml - здесь должен присутствовать домен <loc>http://test.ru</loc>
  Из-за того что наша апишка ничего не знает о домене на котором мы распологаемся, мы будем использовать так же переменной окружение
  Для этого нужно в sitemap.module импортировать ConfigModule
  а здесь в конструкторе контроллера уже использовать configService

  domain: string; - верху объявим domain потому что после того как мы загружаем и получаем домен из конфига, нам нужно его сохранить в этот domain
  this.domain = this.configService.get('DOMAIN') ?? '' - если в переменном окружение DOMAIN будет то подставим его, иначе ''

  тепреь уже займемся методом получения xml
  роботы получают его с помощью метода get
  @Get('xml') - /api/sitemap/xml будет выдавать результат нам этого метода

  @Header позволяет переопределить заголовки которые возвращает метод
  В данном случае нам нужно переопределить Content-Type, мы хотим что бы Content-type был текст xml
  @Header() перым параметром передаём какой заголовок мы переопределяем, а второй параметр уже само значение

  formatString - Нам нужно правильно форматировать дату в lastmod, потому что здесь <lastmod>и здесь дата</lastmod> и нам нужно её правильно модифицировать
  'yyyy-MM-dd' - мы получаем год, месяц, день то-есть 2021-03-26 к примеру и дальше нам нужно передать букву Т
  и что бы эта буква Т правильно инкремировала сюда нам нужно передать её 'yyyy-MM-dd\'T\' - так мы получим просто букву Т
  HH:mm:00.000xxx - дальше после буквы Т идут часы, минуты и все что после минут нам уже не принципиально

  Сам xml2j имеет класс Билдер, который нам позволит строить результирующий xml
  нам нужен xml description в который нам нужно передать версию и енкодинг <?xml version="1.0" encoding="UTF-8"?>

  builder.buildObject - метод buildObject и возвращает нам сам xml, в него нам нужно передать корневой Объект и это <urlset></urlset> который идёт сразу после дескрипшина <?xml version="1.0" encoding="UTF-8"?>

  Через $ мы говорим поле которое будем описывать
  $: {
      xmlns: "http://www.sitemaps.org/schemas/sitemap/0.9"
  }
  говорит что xmlns будет равно "http://www.sitemaps.org/schemas/sitemap/0.9"

  дальше нам нужно во внутрь urlset положить xmlns и что она будет ровна этой строке "http://www.sitemaps.org/schemas/sitemap/0.9"

  дальше кроме urlset у нас есть массив url в которых уже находится loc, lastmod, changefreq, priority
  наш res и будет массивом url

  lastmod: format(addDays(new Date(), - 1)) - Антон сказал что lastmod(последние обновление будем всегда задавать как вчерашнее)
  в datefns есть фция subDays которая по умолчанию убирает один день, так что можно использовать её
  lastmod: format(addDays(new Date(), - 1), formatString) - вторым аргументом передаём строку форматирования

  Это мы описали главную страницу
  let res = [{
    loc: this.domain,
    lastmod: format(addDays(new Date(), - 1), formatString),
    changefreq: 'daily',
    priority: '1.0'
  }];
  Теперь нам нужно описать вторую страницу, но она уже будет труднее, потому что её домен: https://test.ru/courses то-есть этот url содержит courses соотвественно туда будет подставлять динамически категория в зависимости какая категория у нашей странице
  Наша top-page.model имеет enum TopLevelCategory и там курсы, сервисы, книжки и продукты
  И нам нужно сделать некоторую мапу которая подставит соотвествующий url в зависимости от курсов
  создадим файл с константами

  Так как мы запускаемся сейчас только с курсами мы сделаем хардкод второй страницы в res

  Теперь нам нужно сделать динамическое подтягивание всех страниц
  для начала получим все страницы в переменную pages
  const pages = this.topPageService.findAll() - получим массив всех страниц
  дальше нам нужно наполнить res дополнительными значениями

  loc: `${this.domain}${CATRGORY_URL[page.firstCategory]}`, - так мы динамически будет подставлять в домен нужное поле из енама
  в нашей моделе топПейдж firstCategory: TopLevelCategory; 

  дальше в этом же домене через слеш нужно передать alias странички, то-есть как эта страничка называется

  lastmod: format(new Date(page.updatedAt ?? new Date()), formatString) - у нас у page есть метод updatedAt что поможет нам брать информацию когда она была создана, но так как она может быть undefined мы написали page.updatedAt ?? new Date()
*/
