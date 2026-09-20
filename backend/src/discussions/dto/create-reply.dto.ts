import { IsString, MaxLength, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateReplyDto {
  @IsString()
  @MinLength(1, { message: 'content must not be empty' })
  @MaxLength(5000, { message: 'content must be at most 5000 characters' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  content!: string;
}
