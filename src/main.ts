import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConsoleLogger, ValidationPipe } from '@nestjs/common';
// import { join } from 'path';
// import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new ConsoleLogger({
      prefix: 'MyApp', // Default is "Nest"
      logLevels: ['log', 'error', 'warn', 'debug', 'verbose'],
      colors: true,
      timestamp: true,
      json: true,
    }),
  });

  app.enableCors({
    origin: '*', // Adjust this to your needs
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept, Authorization',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strip out properties that are not in the DTO
      forbidNonWhitelisted: true, // throw an error if a property is not in the DTO is in the request body
      transform: true, // transform the request body to be an instance of the DTO class after validation and not a plain object
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('healthCare Management API')
    .setDescription('The healthCare Management API description')
    .setVersion('1.0')
    .addTag('users')
    .addTag('patients')
    .addTag('doctors')
    .addTag('medications')
    .addTag('payments')
    .addTag('medication-stock')
    .addTag('prescriptions')
    .addTag('appointments')
    .addBearerAuth()
    .addTag('medical-history')
    .addServer('http://localhost:8000', 'Local Development Server') // Add server URL
    .addServer('https://api.example.com', 'Production Server') // Add production server URL
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
      docExpansion: 'none', // Collapse all sections by default
      filter: true, // Enable search filter
      showRequestDuration: true, // Show request duration
      tryItOutEnabled: true, // Enable "Try it out" button
    },
  });

  // app.useStaticAssets(join(__dirname, '..', 'public'));
  // app.setBaseViewsDir(join(__dirname, '..', 'views'));
  // app.

  await app.listen(process.env.PORT ?? 3000);

  console.log(`Application is running on: ${await app.getUrl()}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
}
bootstrap();
