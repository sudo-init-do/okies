import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { FirebaseService } from 'src/firestore/firebase.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { AuthenticatedRequest } from 'src/auth/types/authenticated-request.type';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('admin')
@UseGuards(AuthGuard, RolesGuard)
export class AdminController {
  constructor(private readonly firebaseService: FirebaseService) {}

  @Post('promote')
  @Roles('admin')
  async promoteToAdmin(
    @Body('uid') uid: string,
    @Body('secret') secret: string,
    @Req() req: any,
  ) {
    if (secret !== process.env.ADMIN_PROMOTE_SECRET) {
      throw new ForbiddenException('Unauthorized promotion attempt');
    }

    const user = (req as AuthenticatedRequest).user;
    const targetUid = uid || user?.uid;

    if (!targetUid) {
      throw new ForbiddenException('User ID is required');
    }

    await this.firebaseService.updateDocument('users', targetUid, {
      role: 'admin',
    });

    return { message: `User ${targetUid} promoted to admin` };
  }
}
