import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AuthUser } from '../auth/types/auth-user.type';
import { UsersService } from './users.service';
import { QuizHistoryQueryDto } from './dto/quiz-history-query.dto';

@Controller('users/me')
@UseGuards(JwtAuthGuard)
export class UsersMeController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getMe(@CurrentUser() user: AuthUser) {
    return this.usersService.getMe(user.id);
  }

  @Get('progress')
  getMeProgress(@CurrentUser() user: AuthUser) {
    return this.usersService.getMeProgress(user.id);
  }

  @Get('quiz-history')
  getMeQuizHistory(
    @CurrentUser() user: AuthUser,
    @Query() query: QuizHistoryQueryDto,
  ) {
    return this.usersService.getMeQuizHistory(user.id, query);
  }

  @Get('contest-history')
  getMeContestHistory(
    @CurrentUser() user: AuthUser,
    @Query() query: QuizHistoryQueryDto,
  ) {
    return this.usersService.getMeContestHistory(user.id, query);
  }

  @Get('contest-rating')
  getMeContestRating(@CurrentUser() user: AuthUser) {
    return this.usersService.getMeContestRating(user.id);
  }

  @Get('achievements')
  getMeAchievements(@CurrentUser() user: AuthUser) {
    return this.usersService.getMeAchievements(user.id);
  }
}