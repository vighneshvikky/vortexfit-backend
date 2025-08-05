export const IJwtTokenService = Symbol('IJwtTokenService');

import { TokenPayload } from '../interfaces/token-payload.interface';

export interface IJwtTokenService {
  signAccessToken(payload: TokenPayload): string;
  signRefreshToken(payload: TokenPayload): string;
  verifyToken(token: string): TokenPayload;
  decodeToken(token: string): TokenPayload | null;
  signPasswordResetToken(payload: TokenPayload): string;
  verifyPasswordResetToken(token: string): TokenPayload;
  getTokenExpiration(token: string): number | null;
  isTokenBlackListed(token: string): Promise<boolean>;
  verifyRefreshToken(token: string): TokenPayload;
}
