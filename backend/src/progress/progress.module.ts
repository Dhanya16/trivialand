import { Module } from '@nestjs/common';
import { AchievementsService } from './achievements.service';
import { LevelProgressService } from './level-progress.service';

@Module({
  providers: [LevelProgressService, AchievementsService],
  exports: [LevelProgressService, AchievementsService],
})
export class ProgressModule {}
