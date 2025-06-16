import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Goal } from '../entities/goal.entity';
import { GoalsController } from '../controllers/goals.controller';
import { GoalsService } from '../services/goals.service';

// CONTEXT: Module that implements the complete Goal Stack system
// Operationalizes "The Practitioner-Scholar" principle through hierarchical goal management
@Module({
  imports: [TypeOrmModule.forFeature([Goal])],
  controllers: [GoalsController],
  providers: [GoalsService],
  exports: [GoalsService],
})
export class GoalsModule {} 