export const ELO_K_FACTOR = 32;
export const DEFAULT_RATING = 1200;

export function calculateContestRatingChange(
  userRating: number,
  userScore: number,
  maxScore: number,
  opponentRatings: number[],
): number {
  const actual = maxScore === 0 ? 0.5 : userScore / maxScore;
  const avgOpponent =
    opponentRatings.length > 0
      ? opponentRatings.reduce((sum, rating) => sum + rating, 0) /
        opponentRatings.length
      : DEFAULT_RATING;
  const expected = 1 / (1 + Math.pow(10, (avgOpponent - userRating) / 400));

  return Math.round(ELO_K_FACTOR * (actual - expected));
}
