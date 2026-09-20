import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
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
  imports: [PrismaModule,HealthModule,AuthModule,UsersModule,CategoriesModule, ContestsModule, QuizzesModule, DiscussionsModule, AiQuizModule, AchievementsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
