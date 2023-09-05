import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { Routes } from 'src/common/constant/constants';

@ApiTags(Routes.STATUS)
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('test')
  serverIsRunning(): string {
    return this.appService.serverIsRunning();
  }
}
