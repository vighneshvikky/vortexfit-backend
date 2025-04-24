import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';

@Injectable()
export class JwtService {
  constructor(private readonly jwt: NestJwtService) {}

  signAccessToken(payload: any) {
    return this.jwt.sign(payload, { expiresIn: '15m' });
  }

  signRefreshToken(payload: any) {
    return this.jwt.sign(payload, { expiresIn: '7d' });
  }

  verifyToken(token: string) {
    return this.jwt.verify(token);
  }

  decodeToken(token: string) {
    return this.jwt.decode(token);
  }
}
