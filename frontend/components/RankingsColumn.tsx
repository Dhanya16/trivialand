import Link from "next/link";
import type { Ranking } from "@/lib/types";

export const RANKINGS_PREVIEW_LIMIT = 5;

type RankingsColumnProps = {
  items: Ranking[];
  moreHref?: string;
};

export default function RankingsColumn({ items, moreHref = "/contests/rankings" }: RankingsColumnProps) {
  const preview = items.slice(0, RANKINGS_PREVIEW_LIMIT);
  const hasMore = items.length > RANKINGS_PREVIEW_LIMIT;

  return (
    <div className="flex h-full flex-col">
      <h2 className="mb-5 text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)]">
        Rankings
      </h2>

      <div className="card-light flex flex-1 flex-col overflow-hidden p-0">
        <ul className="divide-y divide-[var(--primary)]/10">
          {preview.map((entry) => (
            <li
              key={entry.rank}
              className="flex items-center justify-between px-4 py-3.5 text-sm"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--primary-light)] text-xs font-semibold text-[var(--primary)]">
                  {entry.rank}
                </span>
                <span className="font-medium text-[var(--text)]">{entry.username}</span>
              </div>
              <span className="font-semibold tabular-nums text-[var(--primary)]">
                {entry.rating}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 flex min-h-[48px] items-end">
        {hasMore && (
          <Link href={moreHref} className="btn-secondary block w-full text-center">
            View more
          </Link>
        )}
      </div>
    </div>
  );
}
