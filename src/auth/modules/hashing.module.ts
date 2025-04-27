import { Module } from '@nestjs/common';
import { HashingService } from '../services/hashing.service';

@Module({
  providers: [HashingService],
  exports: [HashingService], // important to EXPORT if you want to use it elsewhere
})
export class HashingModule {}
