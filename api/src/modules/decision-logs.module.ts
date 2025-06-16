import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DecisionLog } from '../entities/decision-log.entity';
import { DecisionLogsService } from '../services/decision-logs.service';
import { DecisionLogsController } from '../controllers/decision-logs.controller';

@Module({
  imports: [TypeOrmModule.forFeature([DecisionLog])],
  controllers: [DecisionLogsController],
  providers: [DecisionLogsService],
  exports: [DecisionLogsService],
})
export class DecisionLogsModule {} 