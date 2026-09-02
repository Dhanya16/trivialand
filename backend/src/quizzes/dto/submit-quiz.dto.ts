import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsString,
  ValidateNested,
} from 'class-validator';

export class SubmitAnswerDto {
  @IsString()
  questionId!: string;

  @IsString()
  selectedOptionId!: string;
}

export class SubmitQuizDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => SubmitAnswerDto)
  answers!: SubmitAnswerDto[];
}