import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersMeController } from './users-me.controller';

@Module({
  controllers: [UsersController,UsersMeController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}