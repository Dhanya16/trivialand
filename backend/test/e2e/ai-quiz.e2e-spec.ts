import { INestApplication } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import request from 'supertest';
import { App } from 'supertest/types';
import { createTestApp } from '../helpers/create-test-app';

async function waitForQuizReady(
  app: INestApplication<App>,
  token: string,
  aiQuizId: string,
) {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const statusRes = await request(app.getHttpServer())
      .get(`/api/ai-quiz/${aiQuizId}/status`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    if (statusRes.body.status === 'ready') {
      return;
    }

    if (statusRes.body.status === 'failed') {
      throw new Error('AI quiz generation failed');
    }

    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  throw new Error('AI quiz generation timed out');
}

describe('AI Quiz (e2e)', () => {
  let app: INestApplication<App>;
  const prisma = new PrismaClient();

  const unique = Date.now().toString(36);
  const email = `aiquiz-${unique}@example.com`;
  const username = `aiquiz_${unique}`;
  const password = 'Password1';

  let accessToken: string;

  beforeAll(async () => {
    app = await createTestApp();

    await prisma.achievement.upsert({
      where: { slug: 'first-ai-quiz' },
      update: {
        name: 'First AI quiz completed',
        description: 'Complete your first AI-generated quiz.',
        criteria: 'ai_quiz_attempts >= 1',
      },
      create: {
        slug: 'first-ai-quiz',
        name: 'First AI quiz completed',
        description: 'Complete your first AI-generated quiz.',
        criteria: 'ai_quiz_attempts >= 1',
      },
    });

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

  it('uploads material, generates a quiz, attempts it, and records history', async () => {
    const uploadRes = await request(app.getHttpServer())
      .post('/api/ai-quiz/upload')
      .set('Authorization', `Bearer ${accessToken}`)
      .attach(
        'file',
        Buffer.from(
          'Newton first law states that an object remains at rest unless acted upon by a force.\nNewton second law relates force, mass, and acceleration.',
        ),
        'physics-notes.txt',
      )
      .expect(201);

    const generateRes = await request(app.getHttpServer())
      .post('/api/ai-quiz/generate')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        materialId: uploadRes.body.id,
        title: 'Physics AI Quiz',
      })
      .expect(201);

    expect(generateRes.body.status).toBe('processing');

    await waitForQuizReady(app, accessToken, generateRes.body.id);

    const quizRes = await request(app.getHttpServer())
      .get(`/api/ai-quiz/${generateRes.body.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(quizRes.body.questions.length).toBeGreaterThan(0);
    expect(quizRes.body.questions[0].options[0].isCorrect).toBeUndefined();

    const submitAnswers = quizRes.body.questions.map(
      (question: {
        id: string;
        options: Array<{ id: string; text: string }>;
      }) => ({
        questionId: question.id,
        selectedOptionId: question.options[0].id,
      }),
    );

    const attemptRes = await request(app.getHttpServer())
      .post(`/api/ai-quiz/${generateRes.body.id}/attempts`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ answers: submitAnswers })
      .expect(200);

    expect(attemptRes.body.score).toBeGreaterThanOrEqual(0);

    const historyRes = await request(app.getHttpServer())
      .get('/api/users/me/quiz-history')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(
      historyRes.body.data.some(
        (item: { type: string; quizTitle: string }) =>
          item.type === 'ai' && item.quizTitle === 'Physics AI Quiz',
      ),
    ).toBe(true);

    const achievementsRes = await request(app.getHttpServer())
      .get('/api/users/me/achievements')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    const slugs = achievementsRes.body.achievements.map(
      (item: { slug: string }) => item.slug,
    );
    expect(slugs).toContain('first-ai-quiz');
  });
});
