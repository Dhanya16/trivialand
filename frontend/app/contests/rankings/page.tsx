import PageLayout from "@/components/PageLayout";
import { rankings } from "@/lib/data";

export default function RankingsPage() {
  return (
    <PageLayout title="Rankings" subtitle="Top players on Trivialand" fullWidth>
      <div className="card-light mx-auto max-w-2xl overflow-hidden p-0">
        <ul className="divide-y divide-[var(--primary)]/10">
          {rankings.map((entry) => (
            <li
              key={entry.rank}
              className="flex items-center justify-between px-5 py-4 text-sm sm:px-6"
            >
              <div className="flex items-center gap-4">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--primary-light)] text-sm font-semibold text-[var(--primary)]">
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
    </PageLayout>
  );
}
