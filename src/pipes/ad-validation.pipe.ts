import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { Types } from 'mongoose';
import { ID_VALIDATION_ERROR } from './ad-validation.constants';

@Injectable()
export class IdValidationPipe implements PipeTransform {
	transform(value: any, metadata: ArgumentMetadata) {
		if (metadata.type !== 'param') return value;
		if (!Types.ObjectId.isValid(value)) {
			//если невалидный
			throw new BadRequestException(ID_VALIDATION_ERROR);
		}
		return value;
	}
}
/*
    ValidationPipe должен имплементировать ПайпТрансформ для того что бы мочь быть использован как пайп

    metadata - данные о том где расспологается данный декоратор

    Injectable - что бы он попал в дерево зависимостей

    нам нужно что бы metadata из всех был только param
*/
