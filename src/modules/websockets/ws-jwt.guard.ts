import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const client: Socket = context.switchToWs().getClient();
      
      // User ID should already be validated and set during handleConnection
      const userId = client['userId'];
      
      if (!userId) {
        throw new UnauthorizedException('User not authenticated');
      }
      
      return true;
    } catch (err) {
      throw new WsException('Unauthorized access');
    }
  }
}