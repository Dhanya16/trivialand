import Link from "next/link";
import GlassCard from "@/components/GlassCard";
import PageLayout from "@/components/PageLayout";
import { AnimatedDiscussionVisual } from "@/components/AnimatedVisuals";
import { discussions } from "@/lib/data";

export default function DiscussionsPage() {
  return (
    <PageLayout
      title="Discussions"
      subtitle="Talk about questions, quizzes, and topics"
      visual={<AnimatedDiscussionVisual />}
    >
      <div className="space-y-3">
        {discussions.map((discussion) => (
          <Link key={discussion.id} href={`/discussions/${discussion.id}`}>
            <GlassCard hover>
              <p className="font-semibold text-[var(--text)]">{discussion.title}</p>
              <p className="mt-1 text-sm text-[var(--text-muted)]">
                by {discussion.author} · {discussion.topic} · {discussion.replyCount} replies ·{" "}
                {discussion.createdAt}
              </p>
            </GlassCard>
          </Link>
        ))}
      </div>
    </PageLayout>
  );
}
