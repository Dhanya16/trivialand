import Button from "@/components/Button";
import GlassCard from "@/components/GlassCard";
import type { Contest } from "@/lib/types";

export default function ContestCard({ contest }: { contest: Contest }) {
  const isLive = contest.status === "live";

  return (
    <GlassCard
      className={`flex min-h-[148px] flex-col ${isLive ? "ring-2 ring-[var(--primary)]/30" : ""}`}
    >
      <p className="font-medium text-[var(--text)]">{contest.title}</p>
      <p className="mt-1.5 flex-1 text-sm leading-relaxed text-[var(--text-muted)]">
        {contest.description}
      </p>
      <p className="mt-3 text-xs text-[var(--text-light)]">
        {new Date(contest.startTime).toLocaleString()} · {contest.durationMinutes} min
      </p>
      {isLive && (
        <Button className="mt-3 w-full text-center">Enter</Button>
      )}
    </GlassCard>
  );
}
