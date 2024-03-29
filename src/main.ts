import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from "@nestjs/common";
import { useContainer } from "class-validator";
import { corsConfig } from "./config/cors.configuration";
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  useContainer(app.select(AppModule), { fallbackOnErrors : true })
  app.enableCors({
    origin: corsConfig.allowedOrigin,
    credentials: true,
  });
  app.use(cookieParser());
  await app.listen(8000);
}
bootstrap();
