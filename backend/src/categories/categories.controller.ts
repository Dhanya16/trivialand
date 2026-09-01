import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { OptionalCurrentUser } from '../auth/decorators/optional-current-user.decorator';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';
import type { AuthUser } from '../auth/types/auth-user.type';
import { CategoriesService } from './categories.service';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':slug/subcategories')
  findSubcategories(@Param('slug') slug: string) {
    return this.categoriesService.findSubcategories(slug);
  }

  @Get(':slug/:subSlug/levels')
  @UseGuards(OptionalJwtAuthGuard)
  findLevels(
    @Param('slug') slug: string,
    @Param('subSlug') subSlug: string,
    @OptionalCurrentUser() user: AuthUser | null,
  ) {
    return this.categoriesService.findLevels(slug, subSlug, user?.id);
  }

  @Get(':slug')
  findBySlug(@Param('slug') slug: string) {
    return this.categoriesService.findBySlug(slug);
  }
}
