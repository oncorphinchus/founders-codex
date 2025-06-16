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
import { PermaService } from '../services/perma.service';
import { CreatePermaEntryDto } from '../dto/create-perma-entry.dto';
import { UpdatePermaEntryDto } from '../dto/update-perma-entry.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

// CONTEXT: Controller implements "Integrated Well-Being" principle by providing
// systematic PERMA model endpoints for preventing founder burnout
@Controller('perma')
@UseGuards(JwtAuthGuard)
export class PermaController {
  constructor(private readonly permaService: PermaService) {}

  // CONTEXT: Upserts daily PERMA entry (primary endpoint for daily tracking)
  @Post('daily')
  upsertDailyEntry(@Body() createPermaEntryDto: CreatePermaEntryDto, @Req() req: any) {
    return this.permaService.upsertDailyEntry(createPermaEntryDto, req.user.id);
  }

  // CONTEXT: Retrieves all PERMA entries with optional date filtering
  @Get()
  findAll(
    @Req() req: any,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.permaService.findAll(req.user.id, start, end);
  }

  // CONTEXT: Gets today's PERMA entry for checking if already completed
  @Get('today')
  getTodaysEntry(@Req() req: any) {
    return this.permaService.getTodaysEntry(req.user.id);
  }

  // CONTEXT: Provides comprehensive well-being analytics and insights
  @Get('analytics')
  getAnalytics(@Req() req: any) {
    return this.permaService.getWellBeingAnalytics(req.user.id);
  }

  // CONTEXT: Retrieves specific PERMA entry
  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.permaService.findOne(id, req.user.id);
  }

  // CONTEXT: Updates existing PERMA entry
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePermaEntryDto: UpdatePermaEntryDto,
    @Req() req: any,
  ) {
    return this.permaService.update(id, updatePermaEntryDto, req.user.id);
  }

  // CONTEXT: Removes PERMA entry with proper user validation
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.permaService.remove(id, req.user.id);
  }
} 