// import {
//   Injectable,
//   NestInterceptor,
//   ExecutionContext,
//   CallHandler,
//   UnauthorizedException,
// } from '@nestjs/common';
// import { Observable, throwError, from } from 'rxjs';
// import { catchError, tap, switchMap } from 'rxjs/operators';
// import { JwtService } from '../services/jwt.service';
// import { TrainerService } from '../../trainer/trainer.service';
// import { UserService } from '../../user/services/user.service';
// import { Response } from 'express';

// @Injectable()
// export class TokenRefreshInterceptor implements NestInterceptor {
//   constructor(
//     private readonly jwtService: JwtService,
//     private readonly trainerService: TrainerService,
//     private readonly userService: UserService,
//   ) {}

//   intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
//     const request = context.switchToHttp().getRequest();
//     const response = context.switchToHttp().getResponse<Response>();
    
//     // Skip token refresh for admin routes
//     if (request.path.startsWith('/admin')) {
//       console.log('Skipping token refresh for admin route');
//       return next.handle();
//     }

//     // Log all cookies for debugging
//     console.log('All cookies:', request.cookies);
//     console.log('Cookie header:', request.headers.cookie);
//     console.log('Request headers:', request.headers);

//     // Get the access token from the cookie
//     const accessToken = request.cookies.access_token;
//     console.log('Access token from cookies:', accessToken);

//     // If no access token in cookies, try to get it from Authorization header
//     if (!accessToken) {
//       const authHeader = request.headers.authorization;
//       if (authHeader && authHeader.startsWith('Bearer ')) {
//         const token = authHeader.substring(7);
//         console.log('Found access token in Authorization header');
//         // Set the token in cookies for future requests
//         response.cookie('access_token', token, {
//           httpOnly: true,
//           secure: false,
//           sameSite: 'lax',
//           path: '/',
//           maxAge: 15 * 60 * 1000, // 15 minutes
//         });
//         return next.handle();
//       }
//       console.log('No access token found in cookies or Authorization header');
//       return next.handle();
//     }

//     try {
//       // Verify the access token
//       const payload = this.jwtService.verifyToken(accessToken);
//       console.log('Access token is valid, payload:', payload);
      
//       // If token is valid, proceed with the request
//       return next.handle();
//     } catch (error) {
//       console.log('Error verifying token:', error);
      
//       // If token is expired or invalid, try to refresh it
//       if (error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError' || error.message === 'TokenExpiredError') {
//         console.log('Access token expired or invalid, attempting refresh');
//         return from(this.handleTokenRefresh(request, response)).pipe(
//           switchMap(() => next.handle())
//         );
//       }
      
//       // For other errors, throw an unauthorized exception
//       console.log('Other error in token verification:', error);
//       return throwError(() => new UnauthorizedException('Invalid token'));
//     }
//   }

//   private async handleTokenRefresh(
//     request: any,
//     response: Response,
//   ): Promise<void> {
//     // Get the refresh token from the cookie
//     const refreshToken = request.cookies?.refresh_token;
//     console.log('Refresh token from cookies:', refreshToken);
    
//     if (!refreshToken) {
//       console.log('No refresh token found in cookies');
//       throw new UnauthorizedException('Refresh token not found');
//     }

//     try {
//       // Verify the refresh token
//       const payload = this.jwtService.verifyToken(refreshToken);
//       console.log('Refresh token payload:', payload);
      
//       // Find the user or trainer based on the role
//       let entity;
//       if (payload.role === 'trainer') {
//         entity = await this.trainerService.findTrainerById(payload.sub);
//       } else if (payload.role === 'user') {
//         entity = await this.userService.findUserById(payload.sub);
//       } else {
//         console.log('Invalid role in refresh token payload');
//         throw new UnauthorizedException('Invalid role');
//       }

//       // Check if the entity exists and has the refresh token
//       if (!entity || entity.refreshToken !== refreshToken) {
//         console.log('Entity not found or refresh token mismatch');
//         throw new UnauthorizedException('Invalid refresh token');
//       }

//       // Check if the refresh token has expired
//       if (entity.refreshTokenExpiresAt && new Date(entity.refreshTokenExpiresAt) < new Date()) {
//         console.log('Refresh token expired');
//         throw new UnauthorizedException('Refresh token expired');
//       }

//       // Generate a new access token
//       const newAccessToken = this.jwtService.signAccessToken({
//         sub: entity._id,
//         email: entity.email,
//         role: payload.role,
//       });
//       console.log('Generated new access token');

//       // Set the new access token in an HTTP-only cookie
//       response.cookie('access_token', newAccessToken, {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === 'production',
//         sameSite: 'lax',
//         path: '/',
//         maxAge: 15 * 60 * 1000, // 15 minutes
//       });
//     } catch (error) {
//       console.log('Error during refresh token handling:', error);
//       throw new UnauthorizedException('Failed to refresh token');
//     }
//   }
// } 