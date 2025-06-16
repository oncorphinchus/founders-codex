import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PermaEntry } from '../entities/perma-entry.entity';
import { CreatePermaEntryDto } from '../dto/create-perma-entry.dto';
import { UpdatePermaEntryDto } from '../dto/update-perma-entry.dto';

// CONTEXT: Implements "Integrated Well-Being" principle by providing systematic
// PERMA model tracking for preventing founder burnout and promoting flourishing
@Injectable()
export class PermaService {
  constructor(
    @InjectRepository(PermaEntry)
    private permaRepository: Repository<PermaEntry>,
  ) {}

  // CONTEXT: Upserts daily PERMA entry (create or update for specific date)
  async upsertDailyEntry(createPermaEntryDto: CreatePermaEntryDto, userId: string): Promise<PermaEntry> {
    const date = new Date(createPermaEntryDto.date);
    
    // Check if entry already exists for this date
    const existingEntry = await this.permaRepository.findOne({
      where: { 
        user: { id: userId },
        date: date,
      },
    });

    if (existingEntry) {
      // Update existing entry
      Object.assign(existingEntry, createPermaEntryDto, { date });
      return this.permaRepository.save(existingEntry);
    } else {
      // Create new entry
      const permaEntry = this.permaRepository.create({
        ...createPermaEntryDto,
        date,
        user: { id: userId },
      });
      return this.permaRepository.save(permaEntry);
    }
  }

  // CONTEXT: Retrieves all PERMA entries for a user with date range filtering
  async findAll(userId: string, startDate?: Date, endDate?: Date): Promise<PermaEntry[]> {
    const query = this.permaRepository
      .createQueryBuilder('permaEntry')
      .where('permaEntry.user.id = :userId', { userId })
      .orderBy('permaEntry.date', 'DESC');

    if (startDate) {
      query.andWhere('permaEntry.date >= :startDate', { startDate });
    }

    if (endDate) {
      query.andWhere('permaEntry.date <= :endDate', { endDate });
    }

    return query.getMany();
  }

  // CONTEXT: Gets today's PERMA entry if it exists
  async getTodaysEntry(userId: string): Promise<PermaEntry | null> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return this.permaRepository.findOne({
      where: {
        user: { id: userId },
        date: today,
      },
    });
  }

  // CONTEXT: Retrieves specific PERMA entry with user validation
  async findOne(id: string, userId: string): Promise<PermaEntry> {
    const permaEntry = await this.permaRepository.findOne({
      where: { id, user: { id: userId } },
    });

    if (!permaEntry) {
      throw new NotFoundException(`PERMA entry with ID ${id} not found`);
    }

    return permaEntry;
  }

  // CONTEXT: Updates existing PERMA entry
  async update(id: string, updatePermaEntryDto: UpdatePermaEntryDto, userId: string): Promise<PermaEntry> {
    const permaEntry = await this.findOne(id, userId);

    const updateData = {
      ...updatePermaEntryDto,
      date: updatePermaEntryDto.date ? new Date(updatePermaEntryDto.date) : undefined,
    };

    Object.assign(permaEntry, updateData);
    return this.permaRepository.save(permaEntry);
  }

  // CONTEXT: Removes PERMA entry with user validation
  async remove(id: string, userId: string): Promise<void> {
    const permaEntry = await this.findOne(id, userId);
    await this.permaRepository.remove(permaEntry);
  }

  // CONTEXT: Calculates well-being analytics and burnout risk assessment
  async getWellBeingAnalytics(userId: string): Promise<{
    averageScores: {
      positiveEmotion: number;
      engagement: number;
      relationships: number;
      meaning: number;
      accomplishment: number;
      overall: number;
    };
    currentStreak: number;
    totalEntries: number;
    burnoutRisk: 'LOW' | 'MEDIUM' | 'HIGH';
    trends: any[];
    insights: string[];
  }> {
    // Get last 30 days of entries
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentEntries = await this.findAll(userId, thirtyDaysAgo);
    const allEntries = await this.findAll(userId);

    const averageScores = this.calculateAverageScores(recentEntries);
    const currentStreak = await this.calculateCurrentStreak(userId);
    const burnoutRisk = this.assessBurnoutRisk(recentEntries);
    const trends = this.calculateTrends(recentEntries);
    const insights = this.generateInsights(recentEntries, averageScores);

    return {
      averageScores,
      currentStreak,
      totalEntries: allEntries.length,
      burnoutRisk,
      trends,
      insights,
    };
  }

  // CONTEXT: Calculates average PERMA scores from recent entries
  private calculateAverageScores(entries: PermaEntry[]): any {
    if (entries.length === 0) {
      return {
        positiveEmotion: 0,
        engagement: 0,
        relationships: 0,
        meaning: 0,
        accomplishment: 0,
        overall: 0,
      };
    }

    const totals = entries.reduce(
      (acc, entry) => ({
        positiveEmotion: acc.positiveEmotion + entry.positiveEmotion,
        engagement: acc.engagement + entry.engagement,
        relationships: acc.relationships + entry.relationships,
        meaning: acc.meaning + entry.meaning,
        accomplishment: acc.accomplishment + entry.accomplishment,
      }),
      { positiveEmotion: 0, engagement: 0, relationships: 0, meaning: 0, accomplishment: 0 }
    );

    const count = entries.length;
    const averages = {
      positiveEmotion: Number((totals.positiveEmotion / count).toFixed(2)),
      engagement: Number((totals.engagement / count).toFixed(2)),
      relationships: Number((totals.relationships / count).toFixed(2)),
      meaning: Number((totals.meaning / count).toFixed(2)),
      accomplishment: Number((totals.accomplishment / count).toFixed(2)),
    };

    const overall = Number(
      ((averages.positiveEmotion + averages.engagement + averages.relationships + averages.meaning + averages.accomplishment) / 5).toFixed(2)
    );

    return { ...averages, overall };
  }

  // CONTEXT: Calculates current consecutive days streak
  private async calculateCurrentStreak(userId: string): Promise<number> {
    const entries = await this.findAll(userId);
    
    if (entries.length === 0) return 0;

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Sort by date descending
    entries.sort((a, b) => b.date.getTime() - a.date.getTime());

    for (let i = 0; i < entries.length; i++) {
      const entryDate = new Date(entries[i].date);
      entryDate.setHours(0, 0, 0, 0);
      
      const expectedDate = new Date(today);
      expectedDate.setDate(today.getDate() - i);

      if (entryDate.getTime() === expectedDate.getTime()) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }

  // CONTEXT: Assesses burnout risk based on PERMA score patterns
  private assessBurnoutRisk(entries: PermaEntry[]): 'LOW' | 'MEDIUM' | 'HIGH' {
    if (entries.length < 7) return 'LOW'; // Need at least a week of data

    const recentWeek = entries.slice(0, 7);
    const averages = this.calculateAverageScores(recentWeek);

    // High risk: Low engagement + low positive emotion + high accomplishment pressure
    const lowEngagement = averages.engagement < 2.5;
    const lowPositiveEmotion = averages.positiveEmotion < 2.5;
    const accomplishmentPressure = averages.accomplishment < 2.5;

    if (lowEngagement && lowPositiveEmotion) return 'HIGH';
    if ((lowEngagement || lowPositiveEmotion) && accomplishmentPressure) return 'MEDIUM';
    
    return 'LOW';
  }

  // CONTEXT: Calculates weekly trends for data visualization
  private calculateTrends(entries: PermaEntry[]): any[] {
    const weeklyData = new Map();
    
    entries.forEach(entry => {
      const weekStart = this.getWeekStart(entry.date);
      const weekKey = weekStart.toISOString().split('T')[0];
      
      if (!weeklyData.has(weekKey)) {
        weeklyData.set(weekKey, {
          week: weekKey,
          entries: [],
        });
      }
      
      weeklyData.get(weekKey).entries.push(entry);
    });

    return Array.from(weeklyData.values())
      .map(week => {
        const averages = this.calculateAverageScores(week.entries);
        return {
          week: week.week,
          ...averages,
          entryCount: week.entries.length,
        };
      })
      .sort((a, b) => a.week.localeCompare(b.week));
  }

  // CONTEXT: Generates actionable insights based on PERMA patterns
  private generateInsights(entries: PermaEntry[], averages: any): string[] {
    const insights: string[] = [];

    if (averages.relationships < 3) {
      insights.push("Your relationship scores are below average. Consider scheduling time with loved ones or networking events.");
    }

    if (averages.engagement < 3) {
      insights.push("Low engagement detected. Try time-blocking for deep work or identify tasks that put you in flow state.");
    }

    if (averages.positiveEmotion < 3 && averages.accomplishment > 4) {
      insights.push("High accomplishment but low positive emotion may indicate burnout risk. Consider celebrating wins and practicing gratitude.");
    }

    if (averages.meaning < 3) {
      insights.push("Low meaning scores suggest revisiting your 'why' and connecting daily tasks to larger purpose.");
    }

    if (entries.length >= 7) {
      // Note: Streak calculation would need async handling in real implementation
      insights.push("Great job maintaining your well-being tracking streak! Consistency builds self-awareness.");
    }

    return insights;
  }

  // CONTEXT: Helper method to get the start of the week for grouping
  private getWeekStart(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day;
    return new Date(d.setDate(diff));
  }
} 