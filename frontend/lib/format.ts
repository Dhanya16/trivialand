export function formatDate(value: string | Date) {
  const date = typeof value === "string" ? new Date(value) : value;
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatScore(score: number, total: number) {
  return `${score}/${total}`;
}

export function formatRatingChange(value: number | null) {
  if (value === null) return "—";
  return value >= 0 ? `+${value}` : String(value);
}
