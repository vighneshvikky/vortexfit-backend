import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { IJwtTokenService } from 'src/auth/interfaces/ijwt-token-service.interface';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService,
    @Inject(IJwtTokenService) private readonly jwtService: IJwtTokenService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request: Request = context.switchToHttp().getRequest();
    const token = request.cookies?.['access_token'];
   
    if (!token) {
      throw new UnauthorizedException('Access token not found');
    }

    try {
      const secret = this.configService.get<string>('ACCESS_TOKEN_SECRET');

      if (!secret) throw new Error('ACCESS_TOKEN_SECRET is not defined');

      const payload = this.jwtService.verifyToken(token);

      request['user'] = payload;
      return true;
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        throw new UnauthorizedException('Access token expired');
      }

      throw new UnauthorizedException('Invalid access token: ' + err.message);
    }
  }
}
