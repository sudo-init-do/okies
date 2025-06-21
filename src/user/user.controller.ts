import { Controller, Get, Patch, Body, UseGuards, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from 'src/user/update-user.dto';
import { AuthGuard } from '@nestjs/passport'; // Correct import
import { DecodedIdToken } from 'firebase-admin/auth';

@Controller('user')
@UseGuards(AuthGuard('jwt')) // Specify JWT strategy
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  getCurrentUser(@Req() req: { user: DecodedIdToken }) {
    return this.userService.getProfile(req.user);
  }

  @Patch('update')
  updateProfile(
    @Req() req: { user: DecodedIdToken },
    @Body() dto: UpdateUserDto,
  ) {
    return this.userService.updateProfile(req.user, dto);
  }
}
