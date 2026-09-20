import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class GenerateAiQuizDto {
  @IsString()
  materialId!: string;

  @IsOptional()
  @IsString()
  @MinLength(3, { message: 'title must be at least 3 characters' })
  @MaxLength(120, { message: 'title must be at most 120 characters' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  title?: string;
}
