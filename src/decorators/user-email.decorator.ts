import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const userEmail = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
	const request = ctx.switchToHttp().getRequest();
	return request.user;
});

/*
    createParamDecorator - принимает данные и контекст исполнения

    ctx - так как это http контекст, то мы работает именно с http контекстом, а если мы бы работали с микросервисами, то это были бы rpc контекст

    getRequest() - даст нам всю инфу по реквесту

    из этого реквеста мы получим юзера в котором и будет наш емейл потому что он состоит только из емейла
*/
