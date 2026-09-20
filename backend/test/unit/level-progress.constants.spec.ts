import {
  calculatePercentage,
  isPassingScore,
  PASSING_PERCENTAGE,
} from '../../src/progress/level-progress.constants';

describe('level-progress.constants', () => {
  it('calculates percentage from score and total', () => {
    expect(calculatePercentage(2, 3)).toBe(67);
    expect(calculatePercentage(3, 3)).toBe(100);
  });

  it('treats scores at or above passing threshold as passing', () => {
    expect(PASSING_PERCENTAGE).toBe(70);
    expect(isPassingScore(7, 10)).toBe(true);
    expect(isPassingScore(6, 10)).toBe(false);
  });
});
