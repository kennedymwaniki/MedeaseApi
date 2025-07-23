import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DoctorsModule } from './doctors/doctors.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { MedicationsModule } from './medications/medications.module';
import { PrescriptionsModule } from './prescriptions/prescriptions.module';
import { MedicationStockModule } from './medication-stock/medication-stock.module';
import { PatientsModule } from './patients/patients.module';
import { MedicalHistoryModule } from './medical-history/medical-history.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MailModule } from './mail/mail.module';
import { PaymentsModule } from './payments/payments.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksModule } from './tasks/tasks.module';
// import { TasksModule } from './tasks/tasks.module';
import { UploadsModule } from './uploads/uploads.module';
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenGuard } from './auth/guards/AccessTokenGuard';
// import { ChatModule } from './chat/chat.module';
import { LogsModule } from './logs/logs.module';
import { DoctorTimeSlotModule } from './doctor-time-slot/doctor-time-slot.module';
import { LoggerMiddleware } from './logger.middleware';
// import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    DoctorsModule,
    AppointmentsModule,
    MedicationsModule,
    PrescriptionsModule,
    MedicationStockModule,
    PatientsModule,
    MedicalHistoryModule,
    AuthModule,
    UsersModule,
    MailModule,
    PaymentsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      // load: [databaseConfig], // path to the environment variables file
    }),
    ScheduleModule.forRoot(),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT'),
        username: configService.get<string>('DATABASE_USERNAME'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),
        autoLoadEntities: true, // Automatically load entities
        synchronize: true, // Set to false in production
        ssl: true,
        PGSSLMODE: 'require',
      }),
    }),

    TasksModule,

    UploadsModule,

    DoctorTimeSlotModule,

    LogsModule,

    // ChatModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
