"use client";

type VisualFrameProps = {
  children: React.ReactNode;
};

function VisualFrame({ children }: VisualFrameProps) {
  return (
    <div
      className="relative mx-auto aspect-video w-full max-w-[300px] overflow-hidden rounded-3xl shadow-[var(--shadow-lg)]"
      style={{ background: "var(--gradient-visual)" }}
    >
      <div className="absolute left-4 top-4 flex gap-1.5">
        <span className="h-2 w-2 rounded-full bg-[var(--primary)]/40" />
        <span className="h-2 w-2 rounded-full bg-[var(--primary)]/40" />
        <span className="h-2 w-2 rounded-full bg-[var(--primary)]/40" />
      </div>
      {children}
    </div>
  );
}

export function AnimatedQuizVisual() {
  return (
    <VisualFrame>
      <div className="absolute inset-0 flex items-center justify-center p-5">
        <div className="animate-float w-full max-w-[210px] rounded-2xl bg-[var(--primary)] p-4 text-white shadow-[var(--shadow-md)]">
          <p className="text-xs font-medium text-white/80">Question 3</p>
          <p className="mt-1.5 text-sm font-medium leading-snug">
            What is the capital of France?
          </p>
        </div>
      </div>
      <div className="animate-float-delayed absolute bottom-5 left-5 rounded-full bg-[var(--primary)] px-3 py-1 text-xs font-medium text-white">
        A
      </div>
      <div className="animate-pulse-soft absolute right-5 top-12 rounded-full bg-[var(--primary)]/80 px-3 py-1 text-xs text-white">
        Live
      </div>
    </VisualFrame>
  );
}

export function AnimatedContestVisual() {
  return (
    <VisualFrame>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
        <div className="animate-tick rounded-full bg-[var(--primary)] px-6 py-3 text-2xl font-bold text-white shadow-sm">
          45:00
        </div>
        <div className="animate-float rounded-2xl bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white">
          Contest in progress
        </div>
      </div>
    </VisualFrame>
  );
}

export function AnimatedAiVisual() {
  return (
    <VisualFrame>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="animate-spin-slow absolute h-24 w-24 rounded-full border border-[var(--primary)]/30" />
        <div className="animate-float rounded-2xl bg-[var(--primary)] px-6 py-5 text-center text-white shadow-sm">
          <p className="text-2xl">✨</p>
          <p className="mt-1.5 text-sm font-medium">Generating...</p>
        </div>
      </div>
    </VisualFrame>
  );
}

export function AnimatedDiscussionVisual() {
  return (
    <VisualFrame>
      <div className="absolute inset-0 flex flex-col justify-center gap-2.5 p-5">
        <div className="animate-float self-start rounded-2xl rounded-bl-md bg-[var(--primary)] px-3.5 py-2 text-xs text-white shadow-sm">
          How do I solve this?
        </div>
        <div className="animate-float-delayed self-end rounded-2xl rounded-br-md bg-[var(--primary)]/90 px-3.5 py-2 text-xs text-white shadow-sm">
          Try breaking it down!
        </div>
      </div>
    </VisualFrame>
  );
}

export function AnimatedProfileVisual() {
  return (
    <VisualFrame>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--primary)] text-lg font-bold text-white">
          P
        </div>
        <div className="animate-float rounded-2xl bg-[var(--primary)] px-5 py-2.5 text-center text-white shadow-sm">
          <p className="text-xs text-white/80">Rating</p>
          <p className="text-lg font-bold">1200</p>
        </div>
      </div>
    </VisualFrame>
  );
}

export function AnimatedLevelsVisual() {
  return (
    <VisualFrame>
      <div className="absolute inset-0 flex flex-col justify-center gap-2.5 p-5">
        <div className="rounded-xl bg-[var(--primary)] px-3 py-2 text-center text-xs font-medium text-emerald-300">
          Level 1 ✓
        </div>
        <div className="animate-pulse-soft rounded-xl bg-[var(--primary)] px-3 py-2 text-center text-xs font-medium text-white">
          Level 2 →
        </div>
        <div className="rounded-xl bg-[var(--primary)]/50 px-3 py-2 text-center text-xs text-white/60">
          Level 3 🔒
        </div>
      </div>
    </VisualFrame>
  );
}

export default AnimatedQuizVisual;
