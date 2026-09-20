"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import GlassCard from "@/components/GlassCard";
import { ApiError } from "@/lib/api/errors";
import { fetchProfile } from "@/lib/api/users";
import { clearStoredToken, getStoredToken } from "@/lib/auth";
import { formatDate, formatRatingChange, formatScore } from "@/lib/format";
import type { UserProfile } from "@/lib/types";

export default function ProfileView() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = getStoredToken();
    if (!token) {
      setLoading(false);
      return;
    }

    fetchProfile(token)
      .then(setProfile)
      .catch((err: unknown) => {
        if (err instanceof ApiError && err.statusCode === 401) {
          clearStoredToken();
          return;
        }
        setError(err instanceof Error ? err.message : "Could not load profile");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-sm text-[var(--text-muted)]">Loading profile...</p>;
  }

  if (!getStoredToken() || !profile) {
    return (
      <GlassCard>
        <p className="text-[var(--text)]">Sign in to view your profile.</p>
        <Link
          href="/login"
          className="mt-3 inline-block text-sm font-medium text-[var(--primary)] hover:underline"
        >
          Go to login
        </Link>
      </GlassCard>
    );
  }

  if (error) {
    return (
      <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        {error}
      </p>
    );
  }

  return (
    <>
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
          {profile.quizHistory.data.length === 0 ? (
            <p className="text-sm text-[var(--text-muted)]">No quizzes completed yet.</p>
          ) : (
            profile.quizHistory.data.map((entry) => (
              <GlassCard
                key={entry.id}
                className="flex flex-col gap-1 text-sm sm:flex-row sm:justify-between"
              >
                <span className="font-medium text-[var(--text)]">{entry.quizTitle}</span>
                <span className="text-[var(--text-muted)]">
                  {formatScore(entry.score, entry.total)} · {formatDate(entry.completedAt)}
                </span>
              </GlassCard>
            ))
          )}
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
          {profile.contestHistory.data.length === 0 ? (
            <p className="text-sm text-[var(--text-muted)]">No contests played yet.</p>
          ) : (
            profile.contestHistory.data.map((entry) => (
              <GlassCard
                key={entry.id}
                className="flex flex-col gap-1 text-sm sm:flex-row sm:justify-between"
              >
                <span className="font-medium text-[var(--text)]">{entry.contestTitle}</span>
                <span className="text-[var(--text-muted)]">
                  {entry.score} pts · {formatRatingChange(entry.ratingChange)} ·{" "}
                  {formatDate(entry.participatedAt)}
                </span>
              </GlassCard>
            ))
          )}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-base font-semibold text-[var(--text)]">Achievements</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {profile.achievements.length === 0 ? (
            <p className="text-sm text-[var(--text-muted)]">No achievements yet.</p>
          ) : (
            profile.achievements.map((achievement) => (
              <GlassCard key={achievement.slug} className="text-sm text-[var(--text)]">
                <p className="font-medium">🏆 {achievement.name}</p>
                <p className="mt-1 text-[var(--text-muted)]">{achievement.description}</p>
              </GlassCard>
            ))
          )}
        </div>
      </section>
    </>
  );
}
