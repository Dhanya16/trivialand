import { Injectable, NotFoundException } from '@nestjs/common';
import { LevelProgressStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import type {
  CategoryResponse,
  LevelResponse,
  LevelStatus,
  SubcategoryResponse,
} from './types/category-response.type';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<CategoryResponse[]> {
    return this.prisma.category.findMany({
      orderBy: { sortOrder: 'asc' },
      select: { slug: true, name: true, description: true },
    });
  }

  async findBySlug(slug: string): Promise<CategoryResponse> {
    const category = await this.prisma.category.findUnique({
      where: { slug },
      select: { slug: true, name: true, description: true },
    });

    if (!category) {
      throw new NotFoundException(`Category "${slug}" not found`);
    }

    return category;
  }

  async findSubcategories(categorySlug: string): Promise<SubcategoryResponse[]> {
    const category = await this.prisma.category.findUnique({
      where: { slug: categorySlug },
      select: { id: true },
    });

    if (!category) {
      throw new NotFoundException(`Category "${categorySlug}" not found`);
    }

    const subcategories = await this.prisma.subcategory.findMany({
      where: { categoryId: category.id },
      orderBy: { name: 'asc' },
      select: { slug: true, name: true },
    });

    return subcategories.map((sub) => ({
      slug: sub.slug,
      name: sub.name,
      categorySlug,
    }));
  }

  async findLevels(
    categorySlug: string,
    subSlug: string,
    userId?: string,
  ): Promise<LevelResponse[]> {
    const subcategory = await this.prisma.subcategory.findFirst({
      where: {
        slug: subSlug,
        category: { slug: categorySlug },
      },
      select: {
        id: true,
        slug: true,
        levels: {
          orderBy: { order: 'asc' },
          select: { id: true, name: true, order: true },
        },
      },
    });

    if (!subcategory) {
      throw new NotFoundException(
        `Subcategory "${subSlug}" not found in category "${categorySlug}"`,
      );
    }

    const levelIds = subcategory.levels.map((level) => level.id);

    const progressRows = userId
      ? await this.prisma.levelProgress.findMany({
          where: { userId, levelId: { in: levelIds } },
          select: { levelId: true, status: true },
        })
      : [];

    const progressByLevelId = new Map(
      progressRows.map((row) => [row.levelId, row.status]),
    );

    let previousCompleted = false;

    return subcategory.levels.map((level) => {
      const status = this.resolveLevelStatus(
        level,
        progressByLevelId.get(level.id),
        previousCompleted,
        userId,
      );

      if (status === 'completed') {
        previousCompleted = true;
      } else {
        previousCompleted = false;
      }

      return {
        id: level.id,
        name: level.name,
        categorySlug,
        subcategorySlug: subSlug,
        status,
      };
    });
  }

  private resolveLevelStatus(
    level: { order: number },
    storedStatus: LevelProgressStatus | undefined,
    previousLevelCompleted: boolean,
    userId?: string,
  ): LevelStatus {
    if (storedStatus) {
      return storedStatus;
    }

    if (!userId) {
      return level.order === 1 ? 'unlocked' : 'locked';
    }

    if (level.order === 1) {
      return 'unlocked';
    }

    return previousLevelCompleted ? 'unlocked' : 'locked';
  }
}