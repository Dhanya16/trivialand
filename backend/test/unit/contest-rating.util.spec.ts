import {
  calculateContestRatingChange,
  DEFAULT_RATING,
  ELO_K_FACTOR,
} from '../../src/contests/contest-rating.util';

describe('contest-rating.util', () => {
  it('awards positive change for a strong score against default opponents', () => {
    const change = calculateContestRatingChange(1200, 3, 3, []);
    expect(change).toBeGreaterThan(0);
  });

  it('awards negative change for a weak score', () => {
    const change = calculateContestRatingChange(1200, 0, 3, [1200]);
    expect(change).toBeLessThan(0);
  });

  it('uses default rating when there are no opponents', () => {
    const change = calculateContestRatingChange(
      DEFAULT_RATING,
      1,
      2,
      [],
    );
    expect(Math.abs(change)).toBeLessThanOrEqual(ELO_K_FACTOR);
  });

  it('returns zero change for a score matching expectation against equal opponents', () => {
    const change = calculateContestRatingChange(1200, 1, 2, [1200]);
    expect(change).toBe(0);
  });

  it('handles zero-point contests without throwing', () => {
    const change = calculateContestRatingChange(1200, 0, 0, []);
    expect(change).toBe(0);
  });

  it('rewards beating higher-rated opponents more than equal opponents', () => {
    const againstEqual = calculateContestRatingChange(1200, 2, 2, [1200]);
    const againstHigher = calculateContestRatingChange(1200, 2, 2, [1500]);
    expect(againstHigher).toBeGreaterThan(againstEqual);
  });
});
