import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/*
- Purpose: Specifically protects the token refresh endpoint
- How it works: Uses the refresh token strategy to validate refresh tokens
 */
@Injectable()
export class RefreshTokenGuard extends AuthGuard('jwt-rt') {
  constructor() {
    super();
  }
}
