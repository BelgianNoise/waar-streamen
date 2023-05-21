import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  openAPI(): string {
    return `openapi`;
  }
}
