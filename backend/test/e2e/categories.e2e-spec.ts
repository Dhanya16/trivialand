import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { createTestApp } from '../helpers/create-test-app';

describe('Categories (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    app = await createTestApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it('lists categories → drills to levels', async () => {
    const listRes = await request(app.getHttpServer())
      .get('/api/categories')
      .expect(200);

    expect(Array.isArray(listRes.body)).toBe(true);
    expect(listRes.body.length).toBeGreaterThan(0);

    const science = listRes.body.find((c: { slug: string }) => c.slug === 'science');
    expect(science).toBeDefined();

    await request(app.getHttpServer())
      .get('/api/categories/science')
      .expect(200)
      .expect((res) => {
        expect(res.body.slug).toBe('science');
        expect(res.body.name).toBe('Science');
      });

    const subsRes = await request(app.getHttpServer())
      .get('/api/categories/science/subcategories')
      .expect(200);

    expect(subsRes.body.some((s: { slug: string }) => s.slug === 'physics')).toBe(true);

    const levelsRes = await request(app.getHttpServer())
      .get('/api/categories/science/physics/levels')
      .expect(200);

    expect(levelsRes.body.length).toBe(3);
    expect(levelsRes.body[0]).toMatchObject({
      name: 'Level 1',
      categorySlug: 'science',
      subcategorySlug: 'physics',
      status: 'unlocked',
    });
    expect(levelsRes.body[1].status).toBe('locked');
  });

  it('returns 404 for invalid category slug', async () => {
    await request(app.getHttpServer())
      .get('/api/categories/not-a-real-category')
      .expect(404);
  });

  it('returns 404 for invalid subcategory slug', async () => {
    await request(app.getHttpServer())
      .get('/api/categories/science/not-a-real-sub/levels')
      .expect(404);
  });
});