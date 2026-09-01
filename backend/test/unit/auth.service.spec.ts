import { Test, TestingModule } from '@nestjs/testing';
import {
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthService } from '../../src/auth/auth.service';
import { PrismaService } from '../../src/prisma/prisma.service';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;

  const prisma = {
    user: {
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  const jwtService = {
    signAsync: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prisma },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  describe('register', () => {
    const dto = {
      email: 'new@example.com',
      username: 'new_user',
      password: 'Password1',
    };

    it('creates a user when email and username are available', async () => {
      prisma.user.findFirst.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');
      prisma.user.create.mockResolvedValue({
        id: 'user-1',
        email: dto.email,
        username: dto.username,
        createdAt: new Date('2026-01-01'),
      });

      const result = await service.register(dto);

      expect(result.message).toBe('Registration successful');
      expect(result.user.email).toBe(dto.email);
    });

    it('throws when email is already registered', async () => {
      prisma.user.findFirst.mockResolvedValue({
        email: dto.email,
        username: 'other',
      });

      await expect(service.register(dto)).rejects.toThrow(ConflictException);
    });

    it('throws when username is already taken', async () => {
      prisma.user.findFirst.mockResolvedValue({
        email: 'other@example.com',
        username: dto.username,
      });

      await expect(service.register(dto)).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    const dto = { email: 'user@example.com', password: 'Password1' };

    it('returns an access token for valid credentials', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: 'user-1',
        email: dto.email,
        username: 'user',
        passwordHash: 'hashed',
        createdAt: new Date('2026-01-01'),
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      jwtService.signAsync.mockResolvedValue('jwt-token');

      const result = await service.login(dto);

      expect(result.accessToken).toBe('jwt-token');
      expect(result.user.email).toBe(dto.email);
    });

    it('throws when user is not found', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(service.login(dto)).rejects.toThrow(UnauthorizedException);
    });

    it('throws when password is wrong', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: 'user-1',
        email: dto.email,
        passwordHash: 'hashed',
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.login(dto)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('getMe', () => {
    it('returns user and profile stub', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: 'user-1',
        email: 'user@example.com',
        username: 'user',
        createdAt: new Date('2026-01-01'),
      });

      const result = await service.getMe('user-1');

      expect(result.user.id).toBe('user-1');
      expect(result.profile.levelsCleared).toBe(0);
    });

    it('throws when user is not found', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(service.getMe('missing')).rejects.toThrow(NotFoundException);
    });
  });
});
