import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
export declare class IdValidationPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata): any;
}
