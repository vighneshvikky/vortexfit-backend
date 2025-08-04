import { Global, Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'REDIS_CLIENT',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const logger = new Logger(RedisModule.name);
        const host = configService.get<string>('REDIS_HOST');
        const port = configService.get<number>('REDIS_PORT');
        const tls = configService.get<string>('REDIS_TLS') === 'true';

        const client = new Redis({
          host,
          port,
          tls: tls ? {} : undefined,
        });

        client.on('connect', () => logger.log('✅ Redis connected'));
        client.on('error', (err) => logger.error('❌ Redis error:', err));

        return client;
      },
    },
  ],
  exports: ['REDIS_CLIENT'],
})
export class RedisModule {}
