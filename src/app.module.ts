import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { mongoConfig } from './config/mongo.config';
import { ConfigModule } from '@nestjs/config';
import { AuthMiddleware } from './auth/middleware/auth-middleware';
import { CookieParserMiddleware } from './auth/middleware/cookie-parser.middleware';
import { JwtService } from './auth/services/jwt.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRootAsync({
      useFactory: mongoConfig,
    }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, JwtService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    // Apply cookie parser middleware to all routes
  
      
    // Apply auth middleware to all routes except auth routes
    // consumer
    //   .apply(AuthMiddleware)
    //   .exclude(
    //     { path: 'auth/signup', method: RequestMethod.POST },
    //     { path: 'auth/login', method: RequestMethod.POST },
    //     { path: 'auth/verify-otp', method: RequestMethod.POST },
    //     { path: 'auth/resend-otp', method: RequestMethod.POST },
    //     { path: 'auth/adminLogin', method: RequestMethod.POST },
    //     { path: 'auth/refresh', method: RequestMethod.POST }
    //   )
    //   .forRoutes('*');
  }
}
