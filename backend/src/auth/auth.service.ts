import {
    ConflictException,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
  import { JwtService } from '@nestjs/jwt';
  import * as bcrypt from 'bcrypt';
  import { PrismaService } from '../prisma/prisma.service';
  import { RegisterDto } from './dto/register.dto';
  import { LoginDto } from './dto/login.dto';
  import { NotFoundException } from '@nestjs/common';
import type { MeResponse } from './types/me-response.type';
  
  @Injectable()
  export class AuthService {
    private readonly saltRounds = 10;
  
    constructor(private readonly prisma: PrismaService, private readonly jwtService: JwtService,) {}
  
    async register(dto: RegisterDto) {
      const existingUser = await this.prisma.user.findFirst({
        where: {
          OR: [{ email: dto.email }, { username: dto.username }],
        },
      });
  
      if (existingUser) {
        if (existingUser.email === dto.email) {
          throw new ConflictException('Email is already registered');
        }
        throw new ConflictException('Username is already taken');
      }
  
      const passwordHash = await bcrypt.hash(dto.password, this.saltRounds);
  
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          username: dto.username,
          passwordHash,
        },
        select: {
          id: true,
          email: true,
          username: true,
          createdAt: true,
        },
      });
  
      return {
        message: 'Registration successful',
        user,
      };
    }
  
    async login(dto: LoginDto) {
        const user = await this.prisma.user.findUnique({
          where: { email: dto.email },
        });
      
        if (!user) {
          throw new UnauthorizedException('Invalid email or password');
        }
      
        const passwordMatches = await bcrypt.compare(dto.password, user.passwordHash);
      
        if (!passwordMatches) {
          throw new UnauthorizedException('Invalid email or password');
        }
      
        const payload = {
          sub: user.id,
          email: user.email,
          username: user.username,
        };
      
        const accessToken = await this.jwtService.signAsync(payload);
      
        return {
          accessToken,
          user: {
            id: user.id,
            email: user.email,
            username: user.username,
            createdAt: user.createdAt,
          },
        };
      }
    async getMe(userId: string): Promise<MeResponse> {
        const user = await this.prisma.user.findUnique({
          where: { id: userId },
          select: {
            id: true,
            email: true,
            username: true,
            createdAt: true,
          },
        });
      
        if (!user) {
          throw new NotFoundException('User not found');
        }
      
        return {
          user,
          profile: {
            levelsCleared: 0,
            contestRating: null,
            quizHistory: [],
            contestHistory: [],
            achievements: [],
          },
        };
      }
  }