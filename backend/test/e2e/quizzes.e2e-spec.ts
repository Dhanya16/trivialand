import { INestApplication } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import request from 'supertest';
import { App } from 'supertest/types';
import { createTestApp } from '../helpers/create-test-app';

describe('Quizzes (e2e)', () => {
  let app: INestApplication<App>;
  const prisma = new PrismaClient();

  const unique = Date.now().toString(36);
  const email = `quiz-${unique}@example.com`;
  const username = `quiz_${unique}`;
  const password = 'Password1';

  let accessToken: string;
  let quizId: string;
  let submitAnswers: { questionId: string; selectedOptionId: string }[];

  beforeAll(async () => {
    app = await createTestApp();

    const quiz = await prisma.quiz.findFirst({
      where: { title: 'Mechanics Basics' },
      include: {
        questions: {
          orderBy: { order: 'asc' },
          include: { options: true },
        },
      },
    });

    if (!quiz) {
      throw new Error('Seed quiz "Mechanics Basics" not found');
    }

    quizId = quiz.id;
    submitAnswers = quiz.questions.map((question) => ({
      questionId: question.id,
      selectedOptionId: question.options[0].id,
    }));

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

  it('takes a quiz end-to-end', async () => {
    await request(app.getHttpServer())
      .get(`/api/quizzes/${quizId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.title).toBe('Mechanics Basics');
        expect(res.body.questionCount).toBeGreaterThan(0);
      });

    const questionsRes = await request(app.getHttpServer())
      .get(`/api/quizzes/${quizId}/questions`)
      .expect(200);

    expect(questionsRes.body[0].options[0].isCorrect).toBeUndefined();

    const startRes = await request(app.getHttpServer())
      .post(`/api/quizzes/${quizId}/attempts`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(201);

    const submitRes = await request(app.getHttpServer())
      .post(`/api/quizzes/${quizId}/attempts/${startRes.body.attemptId}/submit`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        answers: submitAnswers,
      })
      .expect(200);

    expect(submitRes.body.score).toBeGreaterThanOrEqual(0);
    expect(submitRes.body.questions[0].isCorrect).toBeDefined();
    expect(submitRes.body.questions[0].options[0].isCorrect).toBeDefined();
  });
});