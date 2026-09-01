import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { createTestApp } from '../helpers/create-test-app';

describe('Auth (e2e)', () => {
  let app: INestApplication<App>;

  const unique = Date.now().toString(36);
  const email = `auth-${unique}@example.com`;
  const username = `auth_${unique}`;
  const password = 'Password1';

  beforeAll(async () => {
    app = await createTestApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /auth/register creates a user', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({ email, username, password })
      .expect(201);

    expect(res.body.message).toBe('Registration successful');
    expect(res.body.user.email).toBe(email);
  });

  it('POST /auth/register rejects duplicate email', async () => {
    await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({ email, username: `other_${unique}`, password })
      .expect(409);
  });

  it('POST /auth/register rejects invalid password', async () => {
    await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({
        email: `weak-${unique}@example.com`,
        username: `weak_${unique}`,
        password: 'password',
      })
      .expect(400);
  });

  it('POST /auth/login returns access token', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email, password })
      .expect(200);

    expect(res.body.accessToken).toBeDefined();
    expect(res.body.user.username).toBe(username);
  });

  it('POST /auth/login rejects wrong password', async () => {
    await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email, password: 'WrongPass1' })
      .expect(401);
  });

  it('GET /auth/me returns profile stub when authenticated', async () => {
    const loginRes = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email, password })
      .expect(200);

    const res = await request(app.getHttpServer())
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${loginRes.body.accessToken}`)
      .expect(200);

    expect(res.body.user.email).toBe(email);
    expect(res.body.profile).toBeDefined();
  });

  it('GET /auth/me rejects unauthenticated requests', async () => {
    await request(app.getHttpServer()).get('/api/auth/me').expect(401);
  });
});
