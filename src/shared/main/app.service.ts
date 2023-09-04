import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  serverIsRunning(): string {
    return `🚀 Server is running on!  ${process.env.BASE_URL}/docs`;
  }
}
