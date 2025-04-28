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
    try {
      const payload = this.jwt.verify(token);
      return payload;
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        console.log('Token is expired!');
        throw new Error('TokenExpiredError');
      }
      throw err;
    }
  }

  decodeToken(token: string) {
    return this.jwt.decode(token);
  }
}
