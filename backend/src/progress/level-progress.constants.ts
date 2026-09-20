/** Minimum score percentage required to pass a quiz and count toward level completion. */
export const PASSING_PERCENTAGE = 70;

export function calculatePercentage(score: number, total: number): number {
  return total === 0 ? 0 : Math.round((score / total) * 100);
}

export function isPassingScore(score: number, total: number): boolean {
  return calculatePercentage(score, total) >= PASSING_PERCENTAGE;
}
