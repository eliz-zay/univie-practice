import mongoose from 'mongoose';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  const port = Number(process.env.PORT) ?? 8000;
  const host = process.env.HOST ?? 'localhost';

  await mongoose.connect(process.env.MONGO_URL!, { dbName: process.env.DB_NAME! });

  mongoose.set('debug', true);

  await app.listen(port, host, () => {
    console.log(`App listening on ${host}:${port}`);
  });
}

bootstrap();
