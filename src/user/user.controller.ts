import {
  Controller,
  Get,
  Patch,
  Body,
  UseGuards,
  Req,
  HttpCode,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from 'src/user/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { DecodedIdToken } from 'firebase-admin/auth';
import { AuthenticatedRequest } from 'src/auth/types/authenticated-request.type';

@Controller('user')
@UseGuards(AuthGuard('jwt'))
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @HttpCode(200)
  getCurrentUser(@Req() req: AuthenticatedRequest) {
    return this.userService.getProfile(req.user as DecodedIdToken);
  }

  @Patch('update')
  @HttpCode(200)
  updateProfile(@Req() req: AuthenticatedRequest, @Body() dto: UpdateUserDto) {
    return this.userService.updateProfile(req.user as DecodedIdToken, dto);
  }
}
