import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from '../main/app.controller';
import { AppService } from '../main/app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it(`🚀 Server is running on!  ${process.env.BASE_URL}/docs`, () => {
      expect(appController.serverIsRunning()).toBe(
        `🚀 Server is running on!  ${process.env.BASE_URL}/docs`,
      );
    });
  });
});
