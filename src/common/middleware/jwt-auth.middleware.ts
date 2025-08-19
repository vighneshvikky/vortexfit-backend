import { Injectable, NestMiddleware, UnauthorizedException, Inject } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ConfigService } from '@nestjs/config';
import { IJwtTokenService } from 'src/auth/interfaces/ijwt-token-service.interface';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(
    private readonly configService: ConfigService,
    @Inject(IJwtTokenService) private readonly jwtService: IJwtTokenService,
  ) {}

  use(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies?.['access_token'];

    if (!token) {
      throw new UnauthorizedException('Access token not found');
    }

    try {
      const secret = this.configService.get<string>('ACCESS_TOKEN_SECRET');
      if (!secret) throw new Error('ACCESS_TOKEN_SECRET is not defined');

      const payload = this.jwtService.verifyToken(token);


      req['user'] = payload;

      next();
    } catch (err) {
      throw new UnauthorizedException(
        err.message.includes('jwt expired') ? 'Access token expired' : `Invalid access token: ${err.message}`,
      );
    }
  }
}
