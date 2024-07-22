import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { AppConfig } from 'config/config';

async function bootstrap() {
    // Enable main module
    const app = await NestFactory.create(AppModule);
    app.enableCors();

    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            whitelist: true,
        })
    );

    // Generate OpenAPI documentation
    const swagger = new DocumentBuilder()
        .setTitle('API')
        .setVersion('1.0')
        .build();

    const swaggerDocument = SwaggerModule.createDocument(app, swagger);
    SwaggerModule.setup('api', app, swaggerDocument);

    const configService = app.get(ConfigService);
    const port = configService.getOrThrow<AppConfig>('app').port;

    // Start listening to API requests on the specified port
    await app.listen(port, () => {
        Logger.log(`App listening on port ${port}`);
    });
}

bootstrap();