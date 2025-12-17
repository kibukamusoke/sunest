import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  // Override canActivate to make authentication optional
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  // Override handleRequest to allow requests without authentication
  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    // If there's an error or no user, still allow the request to proceed
    // The controller can check if req.user exists
    return user;
  }
}
