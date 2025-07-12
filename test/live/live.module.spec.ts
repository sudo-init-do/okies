// test/live/live.module.spec.ts
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { LiveModule } from '../../src/live/live.module';
import { FirebaseService } from '../../src/firestore/firebase.service';
import { LiveService } from '../../src/live/live.service';
import { AuthGuard } from '../../src/auth/auth.guard';

describe('/live (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LiveModule],
    })
      .overrideProvider(FirebaseService)
      .useValue({}) // no-op Firestore mock
      .overrideProvider(LiveService)
      .useValue({
        getRtcToken: (channelName: string, uid?: number) => ({
          appId: 'testAppId',
          token: `MOCK_TOKEN_FOR_${uid}`,
          uid,
        }),
      })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/live/token (POST) → 201 + { token }', () => {
    return request(app.getHttpServer())
      .post('/live/token')
      .send({ channelName: 'testChannel', uid: 0 })
      .expect(201)
      .expect(res => {
        expect(res.body.token).toBeDefined();
      });
  });
});
