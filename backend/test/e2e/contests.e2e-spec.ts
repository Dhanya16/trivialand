import { INestApplication } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import request from 'supertest';
import { App } from 'supertest/types';
import { createTestApp } from '../helpers/create-test-app';

describe('Contests (e2e)', () => {
  let app: INestApplication<App>;
  const prisma = new PrismaClient();

  const unique = Date.now().toString(36);
  const email = `contest-${unique}@example.com`;
  const username = `contest_${unique}`;
  const password = 'Password1';

  let accessToken: string;
  let contestId: string;
  let submitAnswers: { questionId: string; selectedOptionId: string }[];

  beforeAll(async () => {
    app = await createTestApp();

    const contest = await prisma.contest.findUnique({
      where: { id: 'c2' },
      include: {
        questions: {
          orderBy: { order: 'asc' },
          include: {
            question: {
              include: { options: true },
            },
          },
        },
      },
    });

    if (!contest) {
      throw new Error('Seed contest "c2" not found');
    }

    await prisma.contest.update({
      where: { id: 'c2' },
      data: {
        startTime: new Date(Date.now() - 5 * 60 * 1000),
        durationMinutes: 90,
      },
    });

    contestId = contest.id;
    submitAnswers = contest.questions.map((item) => {
      const correctOption =
        item.question.options.find((option) => option.isCorrect) ??
        item.question.options[0];

      return {
        questionId: item.question.id,
        selectedOptionId: correctOption.id,
      };
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

    const ratingRes = await request(app.getHttpServer())
      .get('/api/users/me/contest-rating')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(ratingRes.body.rating).toBe(1200);
    expect(ratingRes.body.updatedAt).not.toBeNull();
  }, 30000);

  afterAll(async () => {
    await app.close();
    await prisma.$disconnect();
  });

  it('runs the contest flow end-to-end', async () => {
    const liveList = await request(app.getHttpServer())
      .get('/api/contests?status=live')
      .expect(200);

    expect(liveList.body.some((item: { id: string }) => item.id === contestId)).toBe(
      true,
    );

    await request(app.getHttpServer())
      .get(`/api/contests/${contestId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.title).toBe('Friday Night Trivia');
        expect(res.body.status).toBe('live');
        expect(res.body.questionCount).toBeGreaterThan(0);
      });

    const joinRes = await request(app.getHttpServer())
      .post(`/api/contests/${contestId}/join`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(201);

    expect(joinRes.body.participationId).toBeDefined();
    expect(joinRes.body.expiresAt).toBeDefined();

    const questionsRes = await request(app.getHttpServer())
      .get(`/api/contests/${contestId}/questions`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(questionsRes.body[0].options[0].isCorrect).toBeUndefined();

    const submitRes = await request(app.getHttpServer())
      .post(`/api/contests/${contestId}/submit`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ answers: submitAnswers })
      .expect(200);

    expect(submitRes.body.score).toBeGreaterThanOrEqual(0);
    expect(submitRes.body.ratingChange).toBeGreaterThan(0);
    expect(submitRes.body.newRating).toBe(
      1200 + submitRes.body.ratingChange,
    );

    const achievementsRes = await request(app.getHttpServer())
      .get('/api/users/me/achievements')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    const slugs = achievementsRes.body.achievements.map(
      (item: { slug: string }) => item.slug,
    );
    expect(slugs).toContain('first-contest');
    expect(slugs).toContain('rating-1200');

    const standingsRes = await request(app.getHttpServer())
      .get(`/api/contests/${contestId}/standings`)
      .expect(200);

    expect(standingsRes.body.data.length).toBeGreaterThan(0);
    expect(
      standingsRes.body.data.some(
        (item: { username: string }) => item.username === username,
      ),
    ).toBe(true);

    const rankingsRes = await request(app.getHttpServer())
      .get('/api/contests/rankings')
      .expect(200);

    expect(rankingsRes.body.data.length).toBeGreaterThan(0);
    expect(rankingsRes.body.data[0]).toMatchObject({
      rank: expect.any(Number),
      username: expect.any(String),
      rating: expect.any(Number),
    });

    const historyRes = await request(app.getHttpServer())
      .get('/api/users/me/contest-history')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(historyRes.body.data.length).toBeGreaterThan(0);
  });
});
