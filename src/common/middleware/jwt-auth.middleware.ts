import { Inject, Injectable, NestMiddleware } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NextFunction, Request } from "express";
import { IJwtTokenService } from "src/auth/interfaces/ijwt-token-service.interface";

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(
    private readonly configService: ConfigService,
    @Inject(IJwtTokenService) private readonly jwtService: IJwtTokenService,
  ) {}

  use(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies?.['access_token'];
    if (!token) {
      return next(); 
    }

    try {
      const payload = this.jwtService.verifyToken(token);
      req['user'] = payload;
    } catch (err) {
     
      console.error('JWT error:', err.message);
    }

    next();
  }
}
