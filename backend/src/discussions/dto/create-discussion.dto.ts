import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateDiscussionDto {
  @IsString()
  @MinLength(3, { message: 'title must be at least 3 characters' })
  @MaxLength(120, { message: 'title must be at most 120 characters' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  title!: string;

  @IsString()
  @MinLength(2, { message: 'topic must be at least 2 characters' })
  @MaxLength(50, { message: 'topic must be at most 50 characters' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  topic!: string;

  @IsOptional()
  @IsString()
  linkedQuestionId?: string;

  @IsOptional()
  @IsString()
  linkedQuizId?: string;
}
