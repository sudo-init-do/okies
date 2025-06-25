// src/media/cloudflare.controller.ts
import {
  Controller,
  Get,
  Post,
  Query,
  Body,
  Req,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { CloudflareR2Service } from './cloudflare-r2.service';
import { AuthGuard } from '@nestjs/passport';
import { FirebaseService } from 'src/firestore/firebase.service';
import { SaveMediaDto } from 'src/media/save-media.dto';
import { DecodedIdToken } from 'firebase-admin/auth';

@Controller('media')
@UseGuards(AuthGuard('jwt'))
export class CloudflareController {
  constructor(
    private readonly r2Service: CloudflareR2Service,
    private readonly firebaseService: FirebaseService,
  ) {}

  /* --------------------------------------------------------
     GET /media/upload-url
     Returns a time-limited signed URL the client can PUT to.
  --------------------------------------------------------- */
  @Get('upload-url')
  async getUploadUrl(
    @Query('key') key: string,
    @Query('contentType') contentType: string,
  ) {
    if (!key || !contentType) {
      throw new BadRequestException('Missing key or contentType');
    }
    const uploadUrl = await this.r2Service.generateUploadUrl(key, contentType);
    return { uploadUrl };
  }

  /* --------------------------------------------------------
     POST /media/save
     Persist metadata about the uploaded file to Firestore.
  --------------------------------------------------------- */
  @Post('save')
  async saveMedia(
    @Req() req: { user: DecodedIdToken },
    @Body() dto: SaveMediaDto,
  ) {
    if (!dto.key || !dto.contentType) {
      throw new BadRequestException('Missing key or contentType');
    }

    const url = `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${process.env.R2_BUCKET}/${dto.key}`;

    const media = {
      uid: req.user.uid,
      key: dto.key,
      url,
      contentType: dto.contentType,
      createdAt: new Date().toISOString(),
    };

    // let Firestore pick an ID instead of forcing key === docId
    const docId = await this.firebaseService.addDocument('media', media);

    return {
      message: 'Media metadata saved',
      id: docId,
      media,
    };
  }

  /* --------------------------------------------------------
     GET /media/my-uploads
     List all media documents owned by the current user.
  --------------------------------------------------------- */
  @Get('my-uploads')
  async listUserMedia(@Req() req: { user: DecodedIdToken }) {
    const uploads = await this.firebaseService.queryCollectionByField(
      'media',
      'uid',
      req.user.uid,
    );
    return { uploads };
  }
}
