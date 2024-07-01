import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

// so this things is essentially a container where we write are route-handling while
// utilizing are functions called *services* are responsible for route handling

// string param in decorator tells which route controller is responsible for
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
