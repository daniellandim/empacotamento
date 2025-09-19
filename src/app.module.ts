import { Module } from '@nestjs/common';
import { PackingModule } from './packing/packing.module';

@Module({
  imports: [PackingModule],
})
export class AppModule {}
