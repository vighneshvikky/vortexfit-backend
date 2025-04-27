import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { mongoConfig } from './config/mongo.config';
import { ConfigModule } from '@nestjs/config';
import { AuthMiddleware } from './auth/middleware/auth-middleware';

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
  providers: [AppService],
})
export class AppModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer
  //     .apply(AuthMiddleware)
  //     .exclude(
  //       { path: 'auth/signup', method: RequestMethod.POST },
  //       { path: 'auth/login', method: RequestMethod.POST },
  //       { path: 'auth/verify-otp', method: RequestMethod.POST },
  //       { path: 'auth/resend-otp', method: RequestMethod.POST },
  //       {path: 'auth/adminLogin', method: RequestMethod.POST}
  //     )
  //     .forRoutes('*');
  // }
}
