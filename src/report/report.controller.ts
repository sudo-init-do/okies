import { Controller, Post, Body, Get, Req, UseGuards } from '@nestjs/common';
import { ReportService } from './report.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { AdminGuard } from 'src/auth/guards/admin.guard';

@Controller('report')
export class ReportController {
  constructor(private readonly report: ReportService) {}

  @Post()
  @UseGuards(AuthGuard)
  submit(@Req() req, @Body() body: { type: 'user' | 'post'; targetId: string; reason?: string }) {
    return this.report.submitReport(req.user.uid, body);
  }

  @Get('/admin/reports')
  @UseGuards(AuthGuard, AdminGuard)
  getAll() {
    return this.report.listReports();
  }
}
