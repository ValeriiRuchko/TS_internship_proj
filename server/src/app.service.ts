import { Injectable } from '@nestjs/common';

// this file is responsible for giving methods and data
// to work with our defined entities (Users, DB_Schema_obj etc)
@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
