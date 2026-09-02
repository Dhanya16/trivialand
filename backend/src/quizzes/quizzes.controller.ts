import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    UseGuards,
  } from '@nestjs/common';
  import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
  import { CurrentUser } from '../auth/decorators/current-user.decorator';
  import type { AuthUser } from '../auth/types/auth-user.type';
  import { SubmitQuizDto } from './dto/submit-quiz.dto';
  import { QuizzesService } from './quizzes.service';
  
  @Controller('quizzes')
  export class QuizzesController {
    constructor(private readonly quizzesService: QuizzesService) {}
  
    @Get(':id/questions')
    findQuestions(@Param('id') id: string) {
      return this.quizzesService.findQuestions(id);
    }
  
    @Get(':id')
    findById(@Param('id') id: string) {
      return this.quizzesService.findById(id);
    }
  
    @Post(':id/attempts')
    @UseGuards(JwtAuthGuard)
    startAttempt(@Param('id') id: string, @CurrentUser() user: AuthUser) {
      return this.quizzesService.startAttempt(id, user.id);
    }
  
    @Post(':id/attempts/:attemptId/submit')
    @UseGuards(JwtAuthGuard)
    submitAttempt(
      @Param('id') id: string,
      @Param('attemptId') attemptId: string,
      @CurrentUser() user: AuthUser,
      @Body() dto: SubmitQuizDto,
    ) {
      return this.quizzesService.submitAttempt(id, attemptId, user.id, dto);
    }
  }