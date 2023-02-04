import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { HhService } from './hh.service';

@Module({
	providers: [HhService],
	imports: [ConfigModule, HttpModule],
	exports: [HhService],
})
export class HhModule {}

/* ConfigModule - добавили конгфимодуль потому что конфигСервис используется в hh.service

  Мы импортировали TopPageModule в HhModule, но это архитектурно не совсем корректно, потому что наш HhModule является обслуживающим модулем для страниц, то-есть инициализация и обновление страниц должно быть по правильному внутри страничек, а не внутри обслуживающим HhModule
  По-этому мы уберем отсюда TopPageModule
  экспортируем HhService -> импортировать в TopPageModule
  По-этому вся дольнейшая логика будет происходить внутри TopPageModule

*/
