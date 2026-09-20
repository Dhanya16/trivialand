import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { OptionalCurrentUser } from '../auth/decorators/optional-current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';
import type { AuthUser } from '../auth/types/auth-user.type';
import { SubmitQuizDto } from '../quizzes/dto/submit-quiz.dto';
import { ContestsService } from './contests.service';
import { ListContestsQueryDto } from './dto/list-contests-query.dto';
import { PaginationQueryDto } from './dto/pagination-query.dto';

@ApiTags('contests')
@Controller('contests')
export class ContestsController {
  constructor(private readonly contestsService: ContestsService) {}

  @Get('rankings')
  getRankings(@Query() query: PaginationQueryDto) {
    return this.contestsService.getRankings(query);
  }

  @Get()
  findAll(@Query() query: ListContestsQueryDto) {
    return this.contestsService.findAll(query);
  }

  @Get(':id/standings')
  getStandings(@Param('id') id: string, @Query() query: PaginationQueryDto) {
    return this.contestsService.getStandings(id, query);
  }

  @Get(':id/questions')
  @UseGuards(JwtAuthGuard)
  findQuestions(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.contestsService.findQuestions(id, user.id);
  }

  @Get(':id')
  @UseGuards(OptionalJwtAuthGuard)
  findById(
    @Param('id') id: string,
    @OptionalCurrentUser() user: AuthUser | null,
  ) {
    return this.contestsService.findById(id, user?.id);
  }

  @Post(':id/join')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  join(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.contestsService.join(id, user.id);
  }

  @Post(':id/submit')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  submit(
    @Param('id') id: string,
    @CurrentUser() user: AuthUser,
    @Body() dto: SubmitQuizDto,
  ) {
    return this.contestsService.submit(id, user.id, dto);
  }
}
