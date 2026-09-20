export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import GlassCard from "@/components/GlassCard";
import PageLayout from "@/components/PageLayout";
import { AnimatedDiscussionVisual } from "@/components/AnimatedVisuals";
import { fetchDiscussion } from "@/lib/api/discussions";
import { isNotFoundError } from "@/lib/api/fetch";
import { formatDate } from "@/lib/format";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function DiscussionPage({ params }: Props) {
  const { id } = await params;

  try {
    const discussion = await fetchDiscussion(id);

    return (
      <PageLayout
        title={discussion.title}
        subtitle={`by ${discussion.author} · ${discussion.topic} · ${formatDate(discussion.createdAt)}`}
        visual={<AnimatedDiscussionVisual />}
      >
        <h2 className="mb-4 text-base font-semibold text-[var(--text)] sm:text-lg">Replies</h2>
        {discussion.replies.length === 0 ? (
          <p className="text-sm text-[var(--text-muted)]">No replies yet.</p>
        ) : (
          <div className="space-y-3">
            {discussion.replies.map((reply) => (
              <GlassCard key={reply.id}>
                <p className="text-sm font-medium text-[var(--primary)]">{reply.author}</p>
                <p className="mt-2 text-[var(--text)]">{reply.content}</p>
                <p className="mt-2 text-xs text-[var(--text-light)]">
                  {formatDate(reply.createdAt)}
                </p>
              </GlassCard>
            ))}
          </div>
        )}
      </PageLayout>
    );
  } catch (error) {
    if (isNotFoundError(error)) notFound();
    throw error;
  }
}
