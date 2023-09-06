import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './shared/main/app.module';
import { Routes } from './common/constant/constants';
import { nestCsrf } from 'ncsrf';

import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });

  // Habilitando o CORS na aplicação
  app.enableCors({
    credentials: true,
    allowedHeaders: '*',
    origin: '*',
  });

  // Adicionando o ValidationPipe global à aplicação
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.use(cookieParser());

  app.use(nestCsrf());

  // Para conseguir pegar o protocolo https
  app.set('trust proxy', 'loopback');

  // Prefixo api para todas as rotas
  app.setGlobalPrefix('api');

  // Configurando o mecanismo de visualização para o Handlebars
  app.setViewEngine('hbs');

  // Documentação Swagger
  const init = new DocumentBuilder()
    .addTag(Routes.STATUS)
    .addTag(Routes.AUTH)
    .addTag(Routes.ADMIN)
    .addTag(Routes.PAYMENT)
    .addTag(Routes.PATIENT)
    .addTag(Routes.CONSULTA)
    .addBasicAuth()
    .addBearerAuth({
      name: 'Bearer Token',
      type: 'http',
      description: 'Access Token: Insira o Token recebido ao fazer Login',
      in: 'header',
    })
    .setTitle('API - Financeiro Psicólogo')
    .setDescription('Website Financeiro Médico')
    .setTermsOfService('https://www.google.com')
    .setContact('Artemis', 'https://www.contato.com', 'contato@exemplo.com')
    .setExternalDoc(
      'API - Contself',
      'https://documenter.getpostman.com/view/3026223/Szf9VSL2',
    )
    .setLicense(
      'LICENÇA',
      'https://github.com/git/git-scm.com/blob/main/MIT-LICENSE.txt',
    )
    .setVersion('1.0.0')
    //.addServer('https://api.example.com', 'Servidor de Produção')
    .build();

  const document = SwaggerModule.createDocument(app, init);

  SwaggerModule.setup('docs', app, document);

  try {
    await app.listen(3334, () => {
      console.log(`\n 🚀 Server is running on!  ${process.env.BASE_URL}/docs`);
    });
  } catch (err) {
    console.log(err);
  }
}

bootstrap();
