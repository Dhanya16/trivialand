import { Module } from '@nestjs/common';
import { AchievementsModule } from '../achievements/achievements.module';
import { LevelProgressService } from './level-progress.service';

@Module({
  imports: [AchievementsModule],
  providers: [LevelProgressService],
  exports: [LevelProgressService, AchievementsModule],
})
export class ProgressModule {}
