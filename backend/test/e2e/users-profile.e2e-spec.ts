import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { createTestApp } from '../helpers/create-test-app';

describe('Users profile (e2e)', () => {
  let app: INestApplication<App>;

  const unique = Date.now().toString(36);
  const email = `users-${unique}@example.com`;
  const username = `users_${unique}`;
  const password = 'Password1';

  let accessToken: string;

  beforeAll(async () => {
    app = await createTestApp();

    await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({ email, username, password })
      .expect(201);

    const loginRes = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email, password })
      .expect(200);

    accessToken = loginRes.body.accessToken;
  },30000);

  afterAll(async () => {
    await app.close();
  });

  it('GET /users/me returns basic profile', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/users/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(res.body).toMatchObject({ email, username });
  });

  it('GET /users/me/progress returns progress', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/users/me/progress')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(res.body.levelsCleared).toBe(0);
    expect(res.body.levels).toEqual([]);
  });

  it('GET /users/me/contest-rating returns default rating', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/users/me/contest-rating')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(res.body.rating).toBe(1200);
  });

  it('GET /users/me/achievements returns earned badges', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/users/me/achievements')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(Array.isArray(res.body.achievements)).toBe(true);
  });

  it('rejects unauthenticated /users/me', async () => {
    await request(app.getHttpServer()).get('/api/users/me').expect(401);
  });
});
