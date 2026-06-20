import { Controller, HttpCode, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {

  // private appService = new AppService()

  constructor(private readonly appService: AppService) {}

  @Post()
  @HttpCode(200)
  getHello(): { message: string } {
    return this.appService.getHello();
  }
}
