import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';
import { HhData } from 'src/top-page/top-page.model';
import { API_URL, CLUSTER_FIND_ERROR, SALARY_CLUSTER_ID } from './hh.constants';
import { HhResponse } from './hh.models';

@Injectable()
export class HhService {
	private token: string;

	constructor(
		private readonly configService: ConfigService,
		private readonly httpService: HttpService
	) {
		this.token = this.configService.get('HH_TOKEN') ?? '';
	}

	async getData(text: string) {
		try {
			const { data } = await lastValueFrom(
				this.httpService.get<HhResponse>(API_URL.vacancies, {
					params: {
						text,
						clusters: true,
					},
					headers: {
						'User-Agent': 'OwlTop/1.0 (antonlarichev@gmail.com)',
						Authorization: 'Bearer ' + this.token,
					},
				})
			);
			return this.parseData(data);
		} catch (e) {
			Logger.error(e);
		}
	}

	private parseData(data: HhResponse): HhData {
		const salaryCluster = data.clusters.find(c => c.id == SALARY_CLUSTER_ID);
		if (!salaryCluster) {
			throw new Error(CLUSTER_FIND_ERROR);
		}
		const juniorSalary = this.getSalaryFromString(salaryCluster.items[1].name);
		const middleSalary = this.getSalaryFromString(
			salaryCluster.items[Math.ceil(salaryCluster.items.length / 2)].name
		);
		const seniorSalary = this.getSalaryFromString(
			salaryCluster.items[salaryCluster.items.length - 1].name
		);

		return {
			count: data.found,
			juniorSalary,
			middleSalary,
			seniorSalary,
			updatedAt: new Date(),
		};
	}

	private getSalaryFromString(s: string): number {
		const numberRegExp = /(\d+)/g;
		const res = s.match(numberRegExp);
		if (!res) {
			return 0;
		}
		return Number(res[0]);
	}
}

/*
    Здесь мы для экономии времени не будем выносить configSerivce в папку config и не будем писать forRootAsync как это было с телеграмом
    по-этому сразу понятно что в нашем классе будет токен который один раз получается при запуске приложения

    Наш httpService.get принимает доп параметрами: заголовок и параметры text и clusters(всегда в тру потому что мы хотим получать инфу по кластерам)
    то-есть там получается вот такая вот полная юрл:
    https://api.hh.ru/vacancies?text=typescript&clusters=true

    'User-Agent': 'OwlTop' мы назовём нашего юзерАгента - OwlTop

    Если аксиос возвращает просто Промис, то httpModule внутри Неста возвращает observable, с observable можно делать много крутых вещей, но нам что бы сейчас на замарачивваться нужно просто сделать toPromise
    У нас в поле объекта пишется "name": "от 110000 руб.", по-этому нам нужно отсюда вытаскивать с помощью regexpa цифры

    parseData - salaryCluster
    Кластером всегда может быть много, по-этому мы всегда будем брать первый кластер, последний и посередине. В первом кластере находится минимальная зп, в последнем макисмальная
    salaryCluster.items[1].name - потому [0] индексе у элемента никогда нет зарплаты

    count: data.found - сколько всего вакансий
*/
