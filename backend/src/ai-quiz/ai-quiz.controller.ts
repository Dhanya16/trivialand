import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { AuthUser } from '../auth/types/auth-user.type';
import { SubmitQuizDto } from '../quizzes/dto/submit-quiz.dto';
import { MAX_UPLOAD_BYTES } from './ai-quiz.constants';
import { AiQuizService } from './ai-quiz.service';
import { GenerateAiQuizDto } from './dto/generate-ai-quiz.dto';

@ApiTags('ai-quiz')
@ApiBearerAuth()
@Controller('ai-quiz')
@UseGuards(JwtAuthGuard)
export class AiQuizController {
  constructor(private readonly aiQuizService: AiQuizService) {}

  @Post('upload')
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: MAX_UPLOAD_BYTES },
    }),
  )
  uploadMaterial(
    @CurrentUser() user: AuthUser,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    return this.aiQuizService.uploadMaterial(user.id, file);
  }

  @Post('generate')
  @HttpCode(HttpStatus.CREATED)
  generate(@CurrentUser() user: AuthUser, @Body() dto: GenerateAiQuizDto) {
    return this.aiQuizService.generate(user.id, dto);
  }

  @Get(':id/status')
  getStatus(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.aiQuizService.getStatus(id, user.id);
  }

  @Get(':id')
  findById(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.aiQuizService.findById(id, user.id);
  }

  @Post(':id/attempts')
  @HttpCode(HttpStatus.OK)
  submitAttempt(
    @Param('id') id: string,
    @CurrentUser() user: AuthUser,
    @Body() dto: SubmitQuizDto,
  ) {
    return this.aiQuizService.submitAttempt(id, user.id, dto);
  }
}
