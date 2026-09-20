import { ContestStatus } from '@prisma/client';
import { IsEnum, IsOptional } from 'class-validator';

export class ListContestsQueryDto {
  @IsOptional()
  @IsEnum(ContestStatus, {
    message: 'status must be one of: upcoming, live, past',
  })
  status?: ContestStatus;
}
