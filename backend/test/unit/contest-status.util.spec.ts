import { ContestStatus } from '@prisma/client';
import {
  deriveContestStatus,
  getContestEndTime,
  isContestExpired,
} from '../../src/contests/contest-status.util';

describe('contest-status.util', () => {
  const startTime = new Date('2026-08-16T20:00:00.000Z');
  const durationMinutes = 90;

  it('derives upcoming before start time', () => {
    const now = new Date('2026-08-16T19:00:00.000Z');
    expect(
      deriveContestStatus({ startTime, durationMinutes }, now),
    ).toBe(ContestStatus.upcoming);
  });

  it('derives live during the contest window', () => {
    const now = new Date('2026-08-16T20:30:00.000Z');
    expect(
      deriveContestStatus({ startTime, durationMinutes }, now),
    ).toBe(ContestStatus.live);
  });

  it('derives past after the contest ends', () => {
    const now = new Date('2026-08-16T22:00:00.000Z');
    expect(
      deriveContestStatus({ startTime, durationMinutes }, now),
    ).toBe(ContestStatus.past);
  });

  it('computes end time from start and duration', () => {
    expect(getContestEndTime(startTime, durationMinutes).toISOString()).toBe(
      '2026-08-16T21:30:00.000Z',
    );
  });

  it('detects expiry after contest end', () => {
    const now = new Date('2026-08-16T22:00:00.000Z');
    expect(isContestExpired({ startTime, durationMinutes }, now)).toBe(true);
  });
});
