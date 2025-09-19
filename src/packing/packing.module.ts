import { Module } from '@nestjs/common';
import { PackingService } from './paking.service';
import { PackingController } from './paking.controller';

@Module({
  controllers: [PackingController],
  providers: [PackingService],
})
export class PackingModule {}
