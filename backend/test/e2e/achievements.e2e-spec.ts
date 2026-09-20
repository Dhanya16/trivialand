import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { createTestApp } from '../helpers/create-test-app';

describe('Achievements (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    app = await createTestApp();
  }, 30000);

  afterAll(async () => {
    await app.close();
  });

  it('GET /achievements returns achievement definitions', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/achievements')
      .expect(200);

    expect(Array.isArray(res.body.achievements)).toBe(true);
    expect(res.body.achievements.length).toBeGreaterThan(0);
    expect(res.body.achievements[0]).toMatchObject({
      slug: expect.any(String),
      name: expect.any(String),
      description: expect.any(String),
      criteria: expect.any(String),
    });
  });
});
