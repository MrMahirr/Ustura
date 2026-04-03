import { Injectable, PipeTransform, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class CustomValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    // TODO: class-validator ile DTO validasyon mantığı eklenecek
    return value;
  }
}
