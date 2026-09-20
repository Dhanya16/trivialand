import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { AuthUser } from '../auth/types/auth-user.type';
import { DiscussionsService } from './discussions.service';
import { CreateDiscussionDto } from './dto/create-discussion.dto';
import { CreateReplyDto } from './dto/create-reply.dto';

@ApiTags('discussions')
@Controller('discussions')
export class DiscussionsController {
  constructor(private readonly discussionsService: DiscussionsService) {}

  @Get()
  findAll() {
    return this.discussionsService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.discussionsService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  create(@CurrentUser() user: AuthUser, @Body() dto: CreateDiscussionDto) {
    return this.discussionsService.create(user.id, dto);
  }

  @Post(':id/replies')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  addReply(
    @Param('id') id: string,
    @CurrentUser() user: AuthUser,
    @Body() dto: CreateReplyDto,
  ) {
    return this.discussionsService.addReply(id, user.id, dto);
  }
}
