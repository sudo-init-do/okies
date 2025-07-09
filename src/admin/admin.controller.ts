// src/admin/admin.controller.ts
import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  UseGuards,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import { AdminService } from './admin.service';

@Controller('admin')
@UseGuards(AuthGuard, AdminGuard) // user must be authenticated & admin
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  /* ── Dashboard totals ───────────────────────────── */
  @Get('stats')
  getStats() {
    return this.adminService.getStats();
  }

  /* ── All top-up logs ───────────────────────────── */
  @Get('topups')
  getAllTopUps() {
    return this.adminService.getTopUpLogs();
  }

  /* ── User directory ───────────────────────────── */
  @Get('users')
  listUsers(
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit: number,
    @Query('cursor') cursor?: string,
  ) {
    return this.adminService.getAllUsers(limit, cursor);
  }

  /* ── Withdrawals list ───────────────────────────── */
  @Get('withdrawals')
  getWithdrawals(@Query('status') status?: string) {
    return this.adminService.getWithdrawals(status);
  }

  /* ── Approve ───────────────────────────── */
  @Post('withdrawals/:id/approve')
  approve(@Param('id') id: string) {
    return this.adminService.processWithdrawal(id, 'approved');
  }

  /* ── Reject ───────────────────────────── */
  @Post('withdrawals/:id/reject')
  reject(@Param('id') id: string) {
    return this.adminService.processWithdrawal(id, 'rejected');
  }
}
