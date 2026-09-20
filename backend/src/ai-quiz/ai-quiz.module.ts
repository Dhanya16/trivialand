import { Module } from '@nestjs/common';
import { ProgressModule } from '../progress/progress.module';
import { AiGenerationService } from './ai-generation.service';
import { AiQuizController } from './ai-quiz.controller';
import { AiQuizService } from './ai-quiz.service';
import { MockAiProvider } from './providers/mock-ai.provider';
import { OpenAiAiProvider } from './providers/openai-ai.provider';

@Module({
  imports: [ProgressModule],
  controllers: [AiQuizController],
  providers: [
    AiQuizService,
    AiGenerationService,
    MockAiProvider,
    OpenAiAiProvider,
  ],
})
export class AiQuizModule {}
