import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JournalEntry, JournalEntryType } from '../entities/journal-entry.entity';
import { User } from '../entities/user.entity';

// CONTEXT: Implements "The Antifragile User" principle by providing structured
// resilience building tools through journaling and reflection practices
@Injectable()
export class JournalService {
  constructor(
    @InjectRepository(JournalEntry)
    private journalRepository: Repository<JournalEntry>,
  ) {}

  // CONTEXT: Create journal entry with daily uniqueness validation per type
  // Ensures consistent practice without gaming the system
  async create(
    userId: string,
    type: JournalEntryType,
    content: string,
    date?: Date
  ): Promise<JournalEntry> {
    const entryDate = date || new Date();
    entryDate.setHours(0, 0, 0, 0); // Normalize to start of day

    // Check for existing entry of this type for this date
    const existingEntry = await this.journalRepository.findOne({
      where: {
        user: { id: userId },
        type,
        date: entryDate,
      },
    });

    if (existingEntry) {
      throw new ConflictException(
        `Journal entry of type ${type} already exists for ${entryDate.toISOString().split('T')[0]}`
      );
    }

    const journalEntry = this.journalRepository.create({
      user: { id: userId } as User,
      type,
      content,
      date: entryDate,
    });

    return await this.journalRepository.save(journalEntry);
  }

  // CONTEXT: Retrieve all journal entries for a user with optional filtering
  async findAllByUser(
    userId: string,
    type?: JournalEntryType,
    startDate?: Date,
    endDate?: Date
  ): Promise<JournalEntry[]> {
    const query = this.journalRepository
      .createQueryBuilder('journal')
      .where('journal.userId = :userId', { userId })
      .orderBy('journal.date', 'DESC');

    if (type) {
      query.andWhere('journal.type = :type', { type });
    }

    if (startDate) {
      query.andWhere('journal.date >= :startDate', { startDate });
    }

    if (endDate) {
      query.andWhere('journal.date <= :endDate', { endDate });
    }

    return await query.getMany();
  }

  // CONTEXT: Get journal entry by ID with user scoping for security
  async findOneByUser(userId: string, id: string): Promise<JournalEntry> {
    const entry = await this.journalRepository.findOne({
      where: {
        id,
        user: { id: userId },
      },
    });

    if (!entry) {
      throw new NotFoundException('Journal entry not found');
    }

    return entry;
  }

  // CONTEXT: Update journal entry content (same day only)
  async update(
    userId: string,
    id: string,
    content: string
  ): Promise<JournalEntry> {
    const entry = await this.findOneByUser(userId, id);
    
    entry.content = content;
    return await this.journalRepository.save(entry);
  }

  // CONTEXT: Delete journal entry with user scoping
  async remove(userId: string, id: string): Promise<void> {
    const entry = await this.findOneByUser(userId, id);
    await this.journalRepository.remove(entry);
  }

  // CONTEXT: Get journal entries for today across all types
  // Useful for dashboard display and ensuring daily practice
  async getTodaysEntries(userId: string): Promise<JournalEntry[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return await this.journalRepository.find({
      where: {
        user: { id: userId },
        date: today,
      },
      order: {
        type: 'ASC', // STOIC_AM, STOIC_PM, GRATITUDE
      },
    });
  }

  // CONTEXT: Get journal streak for motivation and habit reinforcement
  // Calculates consecutive days with at least one journal entry
  async getJournalStreak(userId: string): Promise<number> {
    const entries = await this.journalRepository
      .createQueryBuilder('journal')
      .select('DISTINCT DATE(journal.date)', 'date')
      .where('journal.userId = :userId', { userId })
      .orderBy('DATE(journal.date)', 'DESC')
      .getRawMany();

    if (entries.length === 0) return 0;

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (const entry of entries) {
      const entryDate = new Date(entry.date);
      entryDate.setHours(0, 0, 0, 0);
      
      const expectedDate = new Date(today);
      expectedDate.setDate(expectedDate.getDate() - streak);

      if (entryDate.getTime() === expectedDate.getTime()) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }

  // CONTEXT: Generate Stoic prompts for morning and evening reflection
  // Implements premeditatio malorum and evening review practices
  getPrompts(type: JournalEntryType): string[] {
    switch (type) {
      case JournalEntryType.STOIC_AM:
        return [
          'What obstacles might I face today, and how can I respond with virtue?',
          'What is within my control today, and what is outside my control?',
          'How can I practice wisdom, courage, justice, and temperance today?',
          'What would Marcus Aurelius do in my situation today?',
          'What am I grateful for as I begin this day?'
        ];
      
      case JournalEntryType.STOIC_PM:
        return [
          'What did I control today? What was outside my control?',
          'Where did I act with wisdom today? Where could I improve?',
          'How did I respond to obstacles? Did I maintain my virtue?',
          'What lessons did today teach me about myself?',
          'How can I be better tomorrow while accepting today as it was?'
        ];
      
      case JournalEntryType.GRATITUDE:
        return [
          'What three specific things am I grateful for today?',
          'Who in my life am I thankful for and why?',
          'What challenge today can I reframe as a gift?',
          'What small moment brought me joy today?',
          'What progress did I make today that I can appreciate?'
        ];
      
      default:
        return ['Reflect on your thoughts and experiences.'];
    }
  }
} 