import { Module } from '@nestjs/common';
import { ProgressModule } from '../progress/progress.module';
import { ContestRatingService } from './contest-rating.service';
import { ContestsController } from './contests.controller';
import { ContestsService } from './contests.service';

@Module({
  imports: [ProgressModule],
  controllers: [ContestsController],
  providers: [ContestsService, ContestRatingService],
  exports: [ContestRatingService],
})
export class ContestsModule {}
