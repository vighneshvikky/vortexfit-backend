import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '../services/jwt.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  use(req: Request, res: Response, next: NextFunction) {
    console.log('Auth middleware processing request:', req.path);
    console.log('Cookies:', req.cookies);
    console.log('Cookie header:', req.headers.cookie);
    
    const accessToken = req.cookies?.access_token;
    console.log('Access token from cookies:', accessToken);
    
    if (!accessToken) {
      console.log('No access token found in cookies');
      return res.status(401).json({
        message: 'Access token is missing',
        expired: false,
      });
    }

    try {
      // Use the JwtService to verify the token
      const decoded = this.jwtService.verifyToken(accessToken);
      console.log('Token verified, payload:', decoded);

      if (typeof decoded === 'string') {
        console.log('Invalid token format');
        return res.status(401).json({
          message: 'Invalid access token',
          expired: false,
        });
      }

      // Check for token expiration for all roles
      const now = Date.now().valueOf() / 1000;
      if (decoded.exp && decoded.exp < now) {
        console.log('Token expired');
        return res.status(401).json({
          message: 'Access token has expired',
          expired: true,
        });
      }

      // Add the decoded token to the request for use in controllers
      req['user'] = decoded;
      console.log('User attached to request:', req['user']);
      
      // Proceed to the next middleware or route handler
      next();
    } catch (error) {
      console.log('Error verifying token:', error);
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          message: 'Access token has expired',
          expired: true,
        });
      }
      
      return res.status(401).json({
        message: 'Invalid access token',
        expired: false,
      });
    }
  }
}
