import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function main() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // If set to true validator will strip validated object of any properties that do not have any decorators.
      forbidNonWhitelisted: true, // If set to true, instead of stripping non-whitelisted properties validator will throw an error
      transform: true, // change the type of params/query/body to the type you set
    }),
  );
  await app.listen(3000);
}
main();
