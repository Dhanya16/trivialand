import { NotFoundException } from '@nestjs/common';
import { LevelProgressStatus } from '@prisma/client';
import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from '../../src/categories/categories.service';
import { PrismaService } from '../../src/prisma/prisma.service';

describe('CategoriesService', () => {
  let service: CategoriesService;

  const prisma = {
    category: { findMany: jest.fn(), findUnique: jest.fn() },
    subcategory: { findMany: jest.fn(), findFirst: jest.fn() },
    levelProgress: { findMany: jest.fn() },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get(CategoriesService);
    jest.clearAllMocks();
  });

  it('lists categories', async () => {
    prisma.category.findMany.mockResolvedValue([
      { slug: 'science', name: 'Science', description: '...' },
    ]);

    const result = await service.findAll();
    expect(result).toHaveLength(1);
    expect(result[0].slug).toBe('science');
  });

  it('throws 404 for unknown category slug', async () => {
    prisma.category.findUnique.mockResolvedValue(null);
    await expect(service.findBySlug('missing')).rejects.toThrow(NotFoundException);
  });

  it('returns subcategories for a category', async () => {
    prisma.category.findUnique.mockResolvedValue({ id: 'cat-1' });
    prisma.subcategory.findMany.mockResolvedValue([
      { slug: 'physics', name: 'Physics' },
    ]);

    const result = await service.findSubcategories('science');
    expect(result[0]).toEqual({
      slug: 'physics',
      name: 'Physics',
      categorySlug: 'science',
    });
  });

  it('returns levels with default status when not authed', async () => {
    prisma.subcategory.findFirst.mockResolvedValue({
      id: 'sub-1',
      slug: 'physics',
      levels: [
        { id: 'l1', name: 'Level 1', order: 1 },
        { id: 'l2', name: 'Level 2', order: 2 },
      ],
    });

    const result = await service.findLevels('science', 'physics');

    expect(result[0].status).toBe('unlocked');
    expect(result[1].status).toBe('locked');
  });

  it('uses stored progress for authed user', async () => {
    prisma.subcategory.findFirst.mockResolvedValue({
      id: 'sub-1',
      slug: 'physics',
      levels: [{ id: 'l1', name: 'Level 1', order: 1 }],
    });
    prisma.levelProgress.findMany.mockResolvedValue([
      { levelId: 'l1', status: LevelProgressStatus.completed },
    ]);

    const result = await service.findLevels('science', 'physics', 'user-1');
    expect(result[0].status).toBe('completed');
  });
});