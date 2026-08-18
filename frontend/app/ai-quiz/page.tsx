import Button from "@/components/Button";
import GlassCard from "@/components/GlassCard";
import PageLayout from "@/components/PageLayout";
import { AnimatedAiVisual } from "@/components/AnimatedVisuals";

export default function AiQuizPage() {
  return (
    <PageLayout
      title="AI Quiz Generator"
      subtitle="Upload your study material and generate a quiz"
      visual={<AnimatedAiVisual />}
    >
      <GlassCard>
        <form>
          <label className="mb-2 block text-sm font-medium text-[var(--text)]" htmlFor="file">
            Upload file
          </label>
          <input
            id="file"
            type="file"
            accept=".pdf,.txt,.doc,.docx,image/*"
            className="mb-6 block w-full rounded-xl border border-[var(--primary)]/15 bg-white/60 p-2 text-sm"
          />

          <label className="mb-2 block text-sm font-medium text-[var(--text)]" htmlFor="notes">
            Or paste your notes
          </label>
          <textarea
            id="notes"
            rows={6}
            placeholder="Paste text from your textbook or notes here..."
            className="mb-6 w-full rounded-xl border border-[var(--primary)]/15 bg-white/60 p-3 text-sm text-[var(--text)] outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-light)]"
          />

          <Button type="submit">Generate Quiz</Button>
        </form>

        <p className="mt-4 text-sm text-[var(--text-muted)]">
          AI integration will be connected to the backend later.
        </p>
      </GlassCard>
    </PageLayout>
  );
}
