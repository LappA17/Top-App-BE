import { TopLevelCategory } from 'src/top-page/top-page.model';

type routeMapType = Record<TopLevelCategory, string>;

export const CATEGORY_URL: routeMapType = {
	0: '/courses',
	1: '/services',
	2: '/books',
	3: '/products',
};

/*
    В routeMapType у нас будет объект в котором ключем будет значение enum нашей топлевелкатегории, а значение будет сам роут

    Record<> принимает два дженерика, первый ключ, второй значение
    type routeMapType = Record<TopLevelCategory, string> благодаря такой типизации мы всегда будем иметь в CATRGORY_URL нужное количество категорий, даже если в будущем появятся новые, приложение сразу выдаст ошибок и напомнит на что нужно добавить категорию сюда
*/
