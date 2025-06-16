import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermaEntry } from '../entities/perma-entry.entity';
import { PermaService } from '../services/perma.service';
import { PermaController } from '../controllers/perma.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PermaEntry])],
  controllers: [PermaController],
  providers: [PermaService],
  exports: [PermaService],
})
export class PermaModule {} 