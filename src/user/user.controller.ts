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

@Controller('user')
@UseGuards(AuthGuard('jwt'))
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @HttpCode(200)
  getCurrentUser(@Req() req: { user: DecodedIdToken }) {
    return this.userService.getProfile(req.user);
  }

  @Patch('update')
  @HttpCode(200)
  updateProfile(
    @Req() req: { user: DecodedIdToken },
    @Body() dto: UpdateUserDto,
  ) {
    return this.userService.updateProfile(req.user, dto);
  }
}
