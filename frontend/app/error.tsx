"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <h2 className="text-lg font-semibold text-[var(--text)]">Something went wrong</h2>
      <p className="mt-2 text-sm text-[var(--text-muted)]">{error.message}</p>
      <button
        type="button"
        onClick={reset}
        className="mt-4 text-sm font-medium text-[var(--primary)] hover:underline"
      >
        Try again
      </button>
    </div>
  );
}
