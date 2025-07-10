// src/admin/admin.controller.ts
import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  Body,
  Req,
  UseGuards,
  DefaultValuePipe,
  ParseIntPipe,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import { AdminService } from './admin.service';

@Controller('admin')
@UseGuards(AuthGuard, AdminGuard) // must be authenticated & admin
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  /* ── Dashboard totals ─────────────────────────────────── */
  @Get('stats')
  getStats() {
    return this.adminService.getStats();
  }

  /* ── All top-up logs ─────────────────────────────────── */
  @Get('topups')
  getAllTopUps() {
    return this.adminService.getTopUpLogs();
  }

  /* ── User directory ─────────────────────────────────── */
  @Get('users')
  async listUsers(
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit: number,
    @Query('cursor') cursor?: string,
  ) {
    return this.adminService.getAllUsers(limit, cursor);
  }

  /* ── Withdrawals list ───────────────────────────────── */
  @Get('withdrawals')
  async getWithdrawals(@Query('status') status?: string) {
    return this.adminService.getWithdrawals(status);
  }

  /* ── Approve / Reject ──────────────────────────────── */
  @Post('withdrawals/:id/approve')
  async approve(@Param('id') id: string) {
    return this.adminService.processWithdrawal(id, 'approved');
  }

  @Post('withdrawals/:id/reject')
  async reject(@Param('id') id: string) {
    return this.adminService.processWithdrawal(id, 'rejected');
  }

  /* ── Create a livestream (Livepeer) ────────────────── */
  @Post('livestream/create')
  createLivestream(@Body() body: { title: string }) {
    return this.adminService.createLivestream(body.title);
  }
}
