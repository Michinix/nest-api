import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello() {
    return {
      message: 'Welcome to the NestJS API!',
      documentation: `${process.env.APP_URL}/api/docs`,
    };
  }
}
