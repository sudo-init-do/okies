import { Controller, Get, Put, Body, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateProfileDto } from 'src/user/update-profile.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Request } from 'express';

@Controller('user')
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  getProfile(@Req() req: Request) {
    return this.userService.getProfile(req.user);
  }

  @Put('me')
  updateProfile(@Req() req: Request, @Body() dto: UpdateProfileDto) {
    return this.userService.updateProfile(req.user, dto);
  }
}
