import { AnimatedAiVisual, AnimatedQuizVisual } from "@/components/AnimatedVisuals";
import Button from "@/components/Button";
import Footer from "@/components/Footer";
import GlassCard from "@/components/GlassCard";
import { contests } from "@/lib/data";

export default function Home() {
  const liveContest = contests.find((c) => c.status === "live");
  const upcomingContest = contests.find((c) => c.status === "upcoming");

  return (
    <div className="home-flow">
      <div className="blob-1" />
      <div className="blob-2" />
      <div className="blob-3" />

      <div className="relative">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 sm:px-6 sm:py-28 md:grid-cols-2 md:gap-20">
          <div>
            <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-[var(--text)] sm:text-5xl lg:text-6xl">
              Explore
              <br />
              <span className="text-[var(--primary)]">Quizzes</span>
            </h1>

            <p className="mt-6 max-w-md text-base leading-relaxed text-[var(--text-muted)] sm:text-lg">
              Browse categories, unlock levels, and test yourself across science,
              history, geography, and more.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Button href="/categories">Start Exploring</Button>
              <Button href="/contests" variant="secondary">
                Join Contests
              </Button>
            </div>

            {(liveContest || upcomingContest) && (
              <GlassCard className="mt-10">
                <p className="text-xs font-medium uppercase tracking-wider text-[var(--primary)]">
                  Live Contest
                </p>
                <p className="mt-1 font-semibold text-[var(--text)]">
                  {liveContest?.title ?? upcomingContest?.title}
                </p>
                <p className="mt-0.5 text-sm text-[var(--text-muted)]">
                  {liveContest
                    ? "Happening now — join in"
                    : `Starts ${new Date(upcomingContest!.startTime).toLocaleString()}`}
                </p>
              </GlassCard>
            )}
          </div>

          <div className="flex justify-center md:justify-end">
            <AnimatedQuizVisual />
          </div>
        </div>

        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 pb-24 pt-8 sm:px-6 sm:pb-32 sm:pt-12 md:grid-cols-2 md:gap-20">
          <div className="order-2 flex justify-center md:order-1 md:justify-start">
            <AnimatedAiVisual />
          </div>

          <div className="order-1 md:order-2">
            <h2 className="text-3xl font-bold leading-[1.15] tracking-tight text-[var(--text)] sm:text-4xl lg:text-5xl">
              AI Quiz
              <br />
              <span className="text-[var(--primary)]">Generator</span>
            </h2>

            <p className="mt-6 max-w-md text-base leading-relaxed text-[var(--text-muted)] sm:text-lg">
              Upload your textbooks, notes, or handwritten pages and turn them
              into a custom quiz instantly.
            </p>

            <div className="mt-9">
              <Button href="/ai-quiz">Try AI Quiz Generator</Button>
            </div>

            <div className="mt-10 space-y-3">
              {[
                { icon: "📄", title: "Upload notes", sub: "PDF, text, or images" },
                { icon: "✨", title: "AI generates quiz", sub: "Ready in seconds" },
                { icon: "🎯", title: "Take your quiz", sub: "Learn your way" },
              ].map((step) => (
                <div key={step.title} className="card-light flex items-center gap-4 px-4 py-3">
                  <div className="icon-btn h-9 w-9 shrink-0 text-base">{step.icon}</div>
                  <div>
                    <p className="text-sm font-medium text-[var(--text)]">{step.title}</p>
                    <p className="text-xs text-[var(--text-muted)]">{step.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
