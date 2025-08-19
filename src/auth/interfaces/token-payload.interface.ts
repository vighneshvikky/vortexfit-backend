

export interface TokenPayload {
  sub: string;
  role: 'user' | 'trainer' | 'admin';
  isBlocked: boolean;
}
