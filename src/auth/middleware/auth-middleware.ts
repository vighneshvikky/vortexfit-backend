import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const accessToken = req.cookies?.access_token;
    
    if (!accessToken) {
      return res.status(401).json({
        message: 'Access token is missing',
        expired: false,
      });
    }

    try {
      // Decode the JWT token
      const decoded = jwt.verify(accessToken, process.env.JWT_SECRET!);

      if (typeof decoded === 'string') {
        return res.status(401).json({
          message: 'Invalid access token',
          expired: false,
        });
      }

      // If the decoded token has role "user", proceed with the request.
      // If it's any other role, skip this middleware and continue.
      if (decoded.role === 'user') {
        // Check for token expiration
        const now = Date.now().valueOf() / 1000;
        if (decoded.exp && decoded.exp < now) {
          return res.status(401).json({
            message: 'Access token has expired',
            expired: true,
          });
        }

        // Proceed to the next middleware or route handler
        next();
      } else {
        // If the role is not 'user', simply continue the request without blocking it.
        next();
      }
    } catch (error) {
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
