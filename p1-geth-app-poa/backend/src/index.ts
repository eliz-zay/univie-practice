import mongoose from 'mongoose';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors();

    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            whitelist: true,
        })
    );

    const swagger = new DocumentBuilder()
        .setTitle('API')
        .setVersion('1.0')
        .build();

    const swaggerDocument = SwaggerModule.createDocument(app, swagger);
    SwaggerModule.setup('api', app, swaggerDocument);

    const configService = app.get(ConfigService);

    const dbUrl = configService.getOrThrow('DB_URL');
    const dbName = configService.getOrThrow('DB_NAME');
    const port = configService.get('PORT') ?? 8000;

    await mongoose.connect(dbUrl, { dbName });

    await app.listen(port, () => {
        console.log(`App listening on port ${port}`);
    });
}

bootstrap();