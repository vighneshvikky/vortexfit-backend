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
     
      const decoded = jwt.verify(accessToken, process.env.JWT_SECRET!);
      

      if (typeof decoded === 'string') {
        return res.status(401).json({
          message: 'Invalid access token',
          expired: false,
        });
      }

    
      const now = Date.now().valueOf() / 1000;
      if (decoded.exp && decoded.exp < now) {
        return res.status(401).json({
          message: 'Access token has expired',
          expired: true,
        });
      }

  
      next();
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