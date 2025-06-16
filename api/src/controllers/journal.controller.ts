import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { JournalService } from '../services/journal.service';
import { CreateJournalEntryDto } from '../dto/create-journal-entry.dto';
import { UpdateJournalEntryDto } from '../dto/update-journal-entry.dto';
import { JournalEntryType } from '../entities/journal-entry.entity';

// CONTEXT: Implements "The Antifragile User" principle through structured journaling
// Provides endpoints for Stoic practices and reflection that build psychological resilience
@Controller('journal')
@UseGuards(JwtAuthGuard)
export class JournalController {
  constructor(private readonly journalService: JournalService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Request() req: any,
    @Body() createJournalEntryDto: CreateJournalEntryDto,
  ) {
    const userId = req.user.id;
    const date = createJournalEntryDto.date ? new Date(createJournalEntryDto.date) : undefined;
    
    const entry = await this.journalService.create(
      userId,
      createJournalEntryDto.type,
      createJournalEntryDto.content,
      date,
    );

    return {
      message: 'Journal entry created successfully',
      entry,
    };
  }

  @Get()
  async findAll(
    @Request() req: any,
    @Query('type') type?: JournalEntryType,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const userId = req.user.id;
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;

    const entries = await this.journalService.findAllByUser(userId, type, start, end);

    return {
      message: 'Journal entries retrieved successfully',
      entries,
      count: entries.length,
    };
  }

  @Get('today')
  async getTodaysEntries(@Request() req: any) {
    const userId = req.user.id;
    const entries = await this.journalService.getTodaysEntries(userId);

    return {
      message: 'Today\'s journal entries retrieved successfully',
      entries,
      date: new Date().toISOString().split('T')[0],
    };
  }

  @Get('streak')
  async getStreak(@Request() req: any) {
    const userId = req.user.id;
    const streak = await this.journalService.getJournalStreak(userId);

    return {
      message: 'Journal streak retrieved successfully',
      streak,
      encouragement: this.getStreakEncouragement(streak),
    };
  }

  @Get('prompts/:type')
  async getPrompts(@Param('type') type: JournalEntryType) {
    const prompts = this.journalService.getPrompts(type);

    return {
      message: 'Journal prompts retrieved successfully',
      type,
      prompts,
    };
  }

  @Get(':id')
  async findOne(@Request() req: any, @Param('id') id: string) {
    const userId = req.user.id;
    const entry = await this.journalService.findOneByUser(userId, id);

    return {
      message: 'Journal entry retrieved successfully',
      entry,
    };
  }

  @Put(':id')
  async update(
    @Request() req: any,
    @Param('id') id: string,
    @Body() updateJournalEntryDto: UpdateJournalEntryDto,
  ) {
    const userId = req.user.id;
    const entry = await this.journalService.update(
      userId,
      id,
      updateJournalEntryDto.content,
    );

    return {
      message: 'Journal entry updated successfully',
      entry,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Request() req: any, @Param('id') id: string) {
    const userId = req.user.id;
    await this.journalService.remove(userId, id);
    
    return {
      message: 'Journal entry deleted successfully',
    };
  }

  // CONTEXT: Provides motivational messages based on journaling consistency
  // Reinforces the "Celebrating Process" principle by recognizing effort
  private getStreakEncouragement(streak: number): string {
    if (streak === 0) {
      return 'Begin your journaling journey today. Every master was once a beginner.';
    } else if (streak === 1) {
      return 'Great start! Consistency is the mother of mastery.';
    } else if (streak < 7) {
      return `${streak} days strong! You\'re building a powerful habit.`;
    } else if (streak < 30) {
      return `${streak} days of reflection! Your wisdom is growing daily.`;
    } else if (streak < 100) {
      return `${streak} days of disciplined practice! You\'re developing true resilience.`;
    } else {
      return `${streak} days of unwavering commitment! You embody the Stoic ideal.`;
    }
  }
} 