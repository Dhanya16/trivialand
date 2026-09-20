import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './common/common.module';
import { CategoriesModule } from './categories/categories.module';
import { ContestsModule } from './contests/contests.module';
import { QuizzesModule } from './quizzes/quizzes.module';
import { PrismaModule } from './prisma/prisma.module';
import { HealthModule } from './health/health.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DiscussionsModule } from './discussions/discussions.module';
import { AiQuizModule } from './ai-quiz/ai-quiz.module';
import { AchievementsModule } from './achievements/achievements.module';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [{ ttl: 60_000, limit: 100 }],
    }),
    CommonModule,
    PrismaModule,
    HealthModule,
    AuthModule,
    UsersModule,
    CategoriesModule,
    ContestsModule,
    QuizzesModule,
    DiscussionsModule,
    AiQuizModule,
    AchievementsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
