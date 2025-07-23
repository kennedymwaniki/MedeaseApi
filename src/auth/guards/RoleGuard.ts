import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from 'src/users/enums/roleEnums';

import { Request } from 'express';
import { JWTPayload } from '../strategies/AccessTokenStrategy';
import { ROLES_KEY } from '../decorators/roles.decorators';

interface UserRequest extends Request {
  user?: JWTPayload;
}
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest<UserRequest>();
    // console.log('RolesGuard: requiredRoles', requiredRoles);

    // const user = request.user;
    // console.log('RolesGuard: request.user', user);

    if (!user) {
      return false; // No user in request
    }

    return requiredRoles.some((role) => user.role === role);
  }
}
