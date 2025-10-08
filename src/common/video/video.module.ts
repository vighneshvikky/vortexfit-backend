import { Module } from '@nestjs/common';
import { VideoGateway } from './video.gateway';
import { SubscriptionModule } from '@/subscription/subscription.module';

@Module({
  imports: [SubscriptionModule],
  providers: [VideoGateway],
  exports: [VideoGateway],
})
export class VideoModule {}
