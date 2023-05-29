import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class StringDefinedPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (!value) {
      throw new BadRequestException('searchTerm is a required query parameter');
    }
    if (typeof value !== 'string') {
      throw new BadRequestException('searchTerm must be a string');
    }
    if (value.length < 2) {
      throw new BadRequestException('searchTerm must be at least 2 characters');
    }
    return value;
  }
}
