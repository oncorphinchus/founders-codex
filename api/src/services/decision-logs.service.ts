import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DecisionLog } from '../entities/decision-log.entity';
import { CreateDecisionLogDto } from '../dto/create-decision-log.dto';
import { UpdateDecisionLogDto } from '../dto/update-decision-log.dto';

// CONTEXT: Implements "Practitioner-Scholar" principle by providing systematic
// decision tracking for building judgment skills and learning from outcomes
@Injectable()
export class DecisionLogsService {
  constructor(
    @InjectRepository(DecisionLog)
    private decisionLogRepository: Repository<DecisionLog>,
  ) {}

  // CONTEXT: Creates new decision log with proper user isolation
  async create(createDecisionLogDto: CreateDecisionLogDto, userId: string): Promise<DecisionLog> {
    const decisionLog = this.decisionLogRepository.create({
      ...createDecisionLogDto,
      date: new Date(createDecisionLogDto.date),
      reviewDate: createDecisionLogDto.reviewDate ? new Date(createDecisionLogDto.reviewDate) : undefined,
      user: { id: userId },
    });

    return this.decisionLogRepository.save(decisionLog);
  }

  // CONTEXT: Retrieves all decision logs for a user with optional filtering
  async findAll(userId: string, includeReviewed?: boolean): Promise<DecisionLog[]> {
    const query = this.decisionLogRepository
      .createQueryBuilder('decisionLog')
      .where('decisionLog.user.id = :userId', { userId })
      .orderBy('decisionLog.date', 'DESC');

    if (includeReviewed === false) {
      query.andWhere('decisionLog.isReviewed = :isReviewed', { isReviewed: false });
    }

    return query.getMany();
  }

  // CONTEXT: Finds decision logs that are due for review (coaching feature)
  async findDueForReview(userId: string): Promise<DecisionLog[]> {
    const today = new Date();
    return this.decisionLogRepository
      .createQueryBuilder('decisionLog')
      .where('decisionLog.user.id = :userId', { userId })
      .andWhere('decisionLog.reviewDate <= :today', { today })
      .andWhere('decisionLog.isReviewed = :isReviewed', { isReviewed: false })
      .orderBy('decisionLog.reviewDate', 'ASC')
      .getMany();
  }

  // CONTEXT: Retrieves single decision log with user validation
  async findOne(id: string, userId: string): Promise<DecisionLog> {
    const decisionLog = await this.decisionLogRepository.findOne({
      where: { id, user: { id: userId } },
    });

    if (!decisionLog) {
      throw new NotFoundException(`Decision log with ID ${id} not found`);
    }

    return decisionLog;
  }

  // CONTEXT: Updates decision log, commonly used when adding actual outcomes
  async update(id: string, updateDecisionLogDto: UpdateDecisionLogDto, userId: string): Promise<DecisionLog> {
    const decisionLog = await this.findOne(id, userId);

    // Convert date strings to Date objects if provided
    const updateData = {
      ...updateDecisionLogDto,
      date: updateDecisionLogDto.date ? new Date(updateDecisionLogDto.date) : undefined,
      reviewDate: updateDecisionLogDto.reviewDate ? new Date(updateDecisionLogDto.reviewDate) : undefined,
    };

    Object.assign(decisionLog, updateData);
    return this.decisionLogRepository.save(decisionLog);
  }

  // CONTEXT: Marks a decision as reviewed with outcome analysis
  async markAsReviewed(id: string, actualOutcome: string, lessonsLearned: string, userId: string): Promise<DecisionLog> {
    const decisionLog = await this.findOne(id, userId);

    decisionLog.actualOutcome = actualOutcome;
    decisionLog.lessonsLearned = lessonsLearned;
    decisionLog.isReviewed = true;

    return this.decisionLogRepository.save(decisionLog);
  }

  // CONTEXT: Removes decision log with user validation
  async remove(id: string, userId: string): Promise<void> {
    const decisionLog = await this.findOne(id, userId);
    await this.decisionLogRepository.remove(decisionLog);
  }

  // CONTEXT: Analytics for improving decision-making quality over time
  async getDecisionAnalytics(userId: string): Promise<{
    totalDecisions: number;
    reviewedDecisions: number;
    averageConfidence: number;
    recentTrends: any[];
  }> {
    const decisions = await this.findAll(userId);
    const reviewedDecisions = decisions.filter(d => d.isReviewed);
    
    const totalDecisions = decisions.length;
    const reviewedCount = reviewedDecisions.length;
    const averageConfidence = reviewedDecisions.length > 0 
      ? reviewedDecisions.reduce((sum, d) => sum + (d.confidenceLevel || 0), 0) / reviewedDecisions.length
      : 0;

    // Get last 30 days of decisions for trend analysis
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentDecisions = decisions.filter(d => d.createdAt >= thirtyDaysAgo);
    const recentTrends = this.calculateDecisionTrends(recentDecisions);

    return {
      totalDecisions,
      reviewedDecisions: reviewedCount,
      averageConfidence,
      recentTrends,
    };
  }

  // CONTEXT: Calculates trends in decision quality and patterns
  private calculateDecisionTrends(decisions: DecisionLog[]): any[] {
    // Group by week and calculate metrics
    const weeklyData = new Map();
    
    decisions.forEach(decision => {
      const weekStart = this.getWeekStart(decision.createdAt);
      const weekKey = weekStart.toISOString().split('T')[0];
      
      if (!weeklyData.has(weekKey)) {
        weeklyData.set(weekKey, {
          week: weekKey,
          decisionsCount: 0,
          avgConfidence: 0,
          reviewedCount: 0,
        });
      }
      
      const weekStats = weeklyData.get(weekKey);
      weekStats.decisionsCount++;
      
      if (decision.isReviewed) {
        weekStats.reviewedCount++;
        weekStats.avgConfidence += decision.confidenceLevel || 0;
      }
    });

    // Calculate averages and return sorted array
    return Array.from(weeklyData.values())
      .map(week => ({
        ...week,
        avgConfidence: week.reviewedCount > 0 ? week.avgConfidence / week.reviewedCount : 0,
      }))
      .sort((a, b) => a.week.localeCompare(b.week));
  }

  // CONTEXT: Helper method to get the start of the week for grouping
  private getWeekStart(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day;
    return new Date(d.setDate(diff));
  }
} 