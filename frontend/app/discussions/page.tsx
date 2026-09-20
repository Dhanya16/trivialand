export const dynamic = "force-dynamic";

import Link from "next/link";
import GlassCard from "@/components/GlassCard";
import PageLayout from "@/components/PageLayout";
import { AnimatedDiscussionVisual } from "@/components/AnimatedVisuals";
import { fetchDiscussions } from "@/lib/api/discussions";
import { formatDate } from "@/lib/format";

export default async function DiscussionsPage() {
  const discussions = await fetchDiscussions();

  return (
    <PageLayout
      title="Discussions"
      subtitle="Talk about questions, quizzes, and topics"
      visual={<AnimatedDiscussionVisual />}
    >
      <div className="space-y-3">
        {discussions.length === 0 ? (
          <p className="text-sm text-[var(--text-muted)]">No discussions yet.</p>
        ) : (
          discussions.map((discussion) => (
            <Link key={discussion.id} href={`/discussions/${discussion.id}`}>
              <GlassCard hover>
                <p className="font-semibold text-[var(--text)]">{discussion.title}</p>
                <p className="mt-1 text-sm text-[var(--text-muted)]">
                  by {discussion.author} · {discussion.topic} · {discussion.replyCount} replies ·{" "}
                  {formatDate(discussion.createdAt)}
                </p>
              </GlassCard>
            </Link>
          ))
        )}
      </div>
    </PageLayout>
  );
}
