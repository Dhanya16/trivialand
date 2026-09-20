import { ContestStatus } from '@prisma/client';

type ContestTiming = {
  startTime: Date;
  durationMinutes: number;
};

export function getContestEndTime(
  startTime: Date,
  durationMinutes: number,
): Date {
  return new Date(startTime.getTime() + durationMinutes * 60 * 1000);
}

export function deriveContestStatus(
  contest: ContestTiming,
  now: Date = new Date(),
): ContestStatus {
  if (now < contest.startTime) {
    return ContestStatus.upcoming;
  }

  if (now < getContestEndTime(contest.startTime, contest.durationMinutes)) {
    return ContestStatus.live;
  }

  return ContestStatus.past;
}

export function isContestExpired(
  contest: ContestTiming,
  now: Date = new Date(),
): boolean {
  return deriveContestStatus(contest, now) === ContestStatus.past;
}
