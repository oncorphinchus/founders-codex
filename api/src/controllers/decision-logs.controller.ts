import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { DecisionLogsService } from '../services/decision-logs.service';
import { CreateDecisionLogDto } from '../dto/create-decision-log.dto';
import { UpdateDecisionLogDto } from '../dto/update-decision-log.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

// CONTEXT: Controller implements "Practitioner-Scholar" principle by providing
// systematic decision tracking endpoints for building judgment skills
@Controller('decision-logs')
@UseGuards(JwtAuthGuard)
export class DecisionLogsController {
  constructor(private readonly decisionLogsService: DecisionLogsService) {}

  // CONTEXT: Creates new decision log entry for systematic tracking
  @Post()
  create(@Body() createDecisionLogDto: CreateDecisionLogDto, @Req() req: any) {
    return this.decisionLogsService.create(createDecisionLogDto, req.user.id);
  }

  // CONTEXT: Retrieves all decision logs with optional filtering
  @Get()
  findAll(@Req() req: any, @Query('includeReviewed') includeReviewed?: string) {
    const includeReviewedBool = includeReviewed === 'true' ? true : includeReviewed === 'false' ? false : undefined;
    return this.decisionLogsService.findAll(req.user.id, includeReviewedBool);
  }

  // CONTEXT: Gets decisions that are due for review (coaching feature)
  @Get('due-for-review')
  findDueForReview(@Req() req: any) {
    return this.decisionLogsService.findDueForReview(req.user.id);
  }

  // CONTEXT: Provides analytics for decision-making improvement
  @Get('analytics')
  getAnalytics(@Req() req: any) {
    return this.decisionLogsService.getDecisionAnalytics(req.user.id);
  }

  // CONTEXT: Retrieves specific decision log
  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.decisionLogsService.findOne(id, req.user.id);
  }

  // CONTEXT: Updates decision log, commonly for adding outcomes
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDecisionLogDto: UpdateDecisionLogDto,
    @Req() req: any,
  ) {
    return this.decisionLogsService.update(id, updateDecisionLogDto, req.user.id);
  }

  // CONTEXT: Specialized endpoint for marking decisions as reviewed with outcomes
  @Patch(':id/review')
  markAsReviewed(
    @Param('id') id: string,
    @Body() body: { actualOutcome: string; lessonsLearned: string },
    @Req() req: any,
  ) {
    return this.decisionLogsService.markAsReviewed(
      id,
      body.actualOutcome,
      body.lessonsLearned,
      req.user.id,
    );
  }

  // CONTEXT: Removes decision log with proper user validation
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.decisionLogsService.remove(id, req.user.id);
  }
} 