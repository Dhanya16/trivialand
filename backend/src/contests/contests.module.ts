import { Module } from '@nestjs/common';
import { ProgressModule } from '../progress/progress.module';
import { ContestsController } from './contests.controller';
import { ContestsService } from './contests.service';

@Module({
  imports: [ProgressModule],
  controllers: [ContestsController],
  providers: [ContestsService],
})
export class ContestsModule {}
