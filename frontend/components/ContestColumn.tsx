import Link from "next/link";
import ContestCard from "@/components/ContestCard";
import type { Contest } from "@/lib/types";

export const CONTEST_PREVIEW_LIMIT = 3;

type ContestColumnProps = {
  title: string;
  items: Contest[];
  moreHref: string;
};

export default function ContestColumn({ title, items, moreHref }: ContestColumnProps) {
  const preview = items.slice(0, CONTEST_PREVIEW_LIMIT);
  const hasMore = items.length > CONTEST_PREVIEW_LIMIT;

  return (
    <div className="flex h-full flex-col">
      <h2 className="mb-5 text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)]">
        {title}
      </h2>

      <div className="flex flex-1 flex-col gap-5">
        {preview.length === 0 ? (
          <p className="text-sm text-[var(--text-light)]">None right now</p>
        ) : (
          preview.map((contest) => <ContestCard key={contest.id} contest={contest} />)
        )}
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
