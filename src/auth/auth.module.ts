import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
// import { Refreshtokenstrategy } from './strategies/RefreshTokenStrategy';
import { AccessTokenStrategy } from './strategies/AccessTokenStrategy';
import { Refreshtokenstrategy } from './strategies/RefreshTokenStrategy';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [AuthController],
  providers: [AuthService, AccessTokenStrategy, Refreshtokenstrategy],
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      global: true,
    }),
  ],
})
export class AuthModule {}
