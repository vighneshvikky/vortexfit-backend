import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { IJwtTokenService } from 'src/auth/interfaces/ijwt-token-service.interface';
import { TokenPayload } from 'src/auth/interfaces/token-payload.interface';

@Injectable()
export class JwtTokenService implements IJwtTokenService {
  constructor(
    private readonly jwt: NestJwtService,
    private configService: ConfigService,
  ) {}

  signAccessToken(payload: TokenPayload): string {
    const secret = this.configService.get<string>('ACCESS_TOKEN_SECRET');
    return this.jwt.sign(payload, {
      secret,
      expiresIn: '1h',
    });
  }

  signRefreshToken(payload: TokenPayload): string {
    const secret = this.configService.get<string>('REFRESH_TOKEN_SECRET');
    return this.jwt.sign(payload, {
      secret,
      expiresIn: '7d',
    });
  }

  verifyToken(token: string): TokenPayload {
    const secret = this.configService.get<string>('ACCESS_TOKEN_SECRET');

    if (!secret) {
      throw new Error('ACCESS_TOKEN_SECRET not defined in config');
    }
    return this.jwt.verify(token, { secret });
  }

  verifyRefreshToken(token: string): TokenPayload {
    const secret = this.configService.get<string>('REFRESH_TOKEN_SECRET');
    return this.jwt.verify(token, { secret });
  }

  decodeToken(token: string): TokenPayload | null {
    return this.jwt.decode(token);
  }

  signPasswordResetToken(payload: TokenPayload): string {
    return this.jwt.sign(payload, {
      expiresIn: '1h',
      secret: process.env.JWT_RESET_SECRET || 'default-reset-secret',
    });
  }

  verifyPasswordResetToken(token: string): TokenPayload {
    return this.jwt.verify(token, {
      secret: process.env.JWT_RESET_SECRET || 'default-reset-secret',
    });
  }
}
