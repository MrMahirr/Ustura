import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { AppConfigService } from './config/config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(AppConfigService);
  const apiPrefix = configService.app.apiPrefix.trim();

  if (apiPrefix) {
    app.setGlobalPrefix(apiPrefix);
  }

  app.useWebSocketAdapter(new IoAdapter(app));
  app.use(helmet());
  app.useGlobalFilters(new GlobalExceptionFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.enableCors({
    origin: configService.cors.origins,
    credentials: configService.cors.credentials,
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Ustura API')
    .setDescription('Reservation, auth, slot and staff management API')
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'access-token',
    )
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(apiPrefix, app, swaggerDocument);

  app.enableShutdownHooks();
  await app.listen(configService.app.port);
}

void bootstrap();
