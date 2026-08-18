import GlassCard from "@/components/GlassCard";
import PageLayout from "@/components/PageLayout";
import { AnimatedProfileVisual } from "@/components/AnimatedVisuals";
import { profile } from "@/lib/data";

export default function ProfilePage() {
  return (
    <PageLayout
      title="Profile"
      subtitle={`@${profile.username}`}
      visual={<AnimatedProfileVisual />}
    >
      <section className="mb-8">
        <h2 className="mb-3 text-base font-semibold text-[var(--text)]">Levels Cleared</h2>
        <GlassCard>
          <p className="text-2xl font-bold text-[var(--primary)]">
            {profile.levelsCleared}
            <span className="ml-2 text-base font-normal text-[var(--text-muted)]">
              level{profile.levelsCleared !== 1 ? "s" : ""}
            </span>
          </p>
        </GlassCard>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-base font-semibold text-[var(--text)]">Quiz History</h2>
        <div className="space-y-3">
          {profile.quizHistory.map((entry, index) => (
            <GlassCard key={index} className="flex flex-col gap-1 text-sm sm:flex-row sm:justify-between">
              <span className="font-medium text-[var(--text)]">{entry.title}</span>
              <span className="text-[var(--text-muted)]">{entry.score} · {entry.date}</span>
            </GlassCard>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-base font-semibold text-[var(--text)]">Contest Rating</h2>
        <GlassCard>
          <p className="text-3xl font-bold text-[var(--primary)]">{profile.contestRating}</p>
        </GlassCard>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-base font-semibold text-[var(--text)]">Contest History</h2>
        <div className="space-y-3">
          {profile.contestHistory.map((entry, index) => (
            <GlassCard key={index} className="flex flex-col gap-1 text-sm sm:flex-row sm:justify-between">
              <span className="font-medium text-[var(--text)]">{entry.title}</span>
              <span className="text-[var(--text-muted)]">
                {entry.score} pts · {entry.ratingChange} · {entry.date}
              </span>
            </GlassCard>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-base font-semibold text-[var(--text)]">Achievements</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {profile.achievements.map((achievement) => (
            <GlassCard key={achievement} className="text-sm font-medium text-[var(--text)]">
              🏆 {achievement}
            </GlassCard>
          ))}
        </div>
      </section>
    </PageLayout>
  );
}
