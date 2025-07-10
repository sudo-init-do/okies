import { Controller, Post, Delete, Get, Param, Req, UseGuards } from '@nestjs/common';
import { FollowService } from './follow.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('follow')
@UseGuards(AuthGuard)
export class FollowController {
  constructor(private readonly follow: FollowService) {}

  @Post(':uid')
  followUser(@Req() req, @Param('uid') uid: string) {
    return this.follow.follow(req.user.uid, uid);
  }

  @Delete(':uid')
  unfollowUser(@Req() req, @Param('uid') uid: string) {
    return this.follow.unfollow(req.user.uid, uid);
  }

  @Get('followers')
  getFollowers(@Req() req) {
    return this.follow.listFollowers(req.user.uid);
  }

  @Get('following')
  getFollowing(@Req() req) {
    return this.follow.listFollowing(req.user.uid);
  }

  /** Quick “people you may know” — 10 random users not yet followed */
  @Get('suggested')
  suggested(@Req() req) {
    return this.follow.suggested(req.user.uid);
  }
}
