import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoriesModule } from './categories/categories.module';
import { ContestsModule } from './contests/contests.module';
import { QuizzesModule } from './quizzes/quizzes.module';

@Module({
  imports: [CategoriesModule, ContestsModule, QuizzesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
