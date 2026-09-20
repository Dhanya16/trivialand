import { INestApplication } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import request from 'supertest';
import { App } from 'supertest/types';
import { createTestApp } from '../helpers/create-test-app';

describe('Discussions (e2e)', () => {
  let app: INestApplication<App>;
  const prisma = new PrismaClient();

  const unique = Date.now().toString(36);
  const email = `discuss-${unique}@example.com`;
  const username = `discuss_${unique}`;
  const password = 'Password1';

  let accessToken: string;
  let quizId: string;

  beforeAll(async () => {
    app = await createTestApp();

    const quiz = await prisma.quiz.findFirst({
      where: { title: 'Mechanics Basics' },
      select: { id: true },
    });

    if (!quiz) {
      throw new Error('Seed quiz "Mechanics Basics" not found');
    }

    quizId = quiz.id;

    await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({ email, username, password })
      .expect(201);

    const loginRes = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email, password })
      .expect(200);

    accessToken = loginRes.body.accessToken;
  }, 30000);

  afterAll(async () => {
    await app.close();
    await prisma.$disconnect();
  });

  it('creates a thread, replies, and lists discussions', async () => {
    const createRes = await request(app.getHttpServer())
      .post('/api/discussions')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'How do I approach mechanics quizzes?',
        topic: 'Physics',
        linkedQuizId: quizId,
      })
      .expect(201);

    expect(createRes.body.author).toBe(username);
    expect(createRes.body.replyCount).toBe(0);

    const threadId = createRes.body.id;

    const replyRes = await request(app.getHttpServer())
      .post(`/api/discussions/${threadId}/replies`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        content: 'Start with free-body diagrams and units.',
      })
      .expect(201);

    expect(replyRes.body.author).toBe(username);
    expect(replyRes.body.content).toContain('free-body diagrams');

    const detailRes = await request(app.getHttpServer())
      .get(`/api/discussions/${threadId}`)
      .expect(200);

    expect(detailRes.body.replyCount).toBe(1);
    expect(detailRes.body.linkedQuizId).toBe(quizId);
    expect(detailRes.body.replies).toHaveLength(1);

    const listRes = await request(app.getHttpServer())
      .get('/api/discussions')
      .expect(200);

    const createdThread = listRes.body.find(
      (item: { id: string }) => item.id === threadId,
    );

    expect(createdThread).toBeDefined();
    expect(createdThread.replyCount).toBe(1);
    expect(createdThread.title).toBe('How do I approach mechanics quizzes?');
  });
});
