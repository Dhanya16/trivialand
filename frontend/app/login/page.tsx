"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import Button from "@/components/Button";
import GlassCard from "@/components/GlassCard";
import PageLayout from "@/components/PageLayout";
import { login, register } from "@/lib/api/auth";
import { setStoredToken } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === "login") {
        const response = await login(email, password);
        setStoredToken(response.accessToken);
      } else {
        await register(email, username, password);
        const response = await login(email, password);
        setStoredToken(response.accessToken);
      }
      router.push("/profile");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageLayout title={mode === "login" ? "Log in" : "Register"} subtitle="Access your Trivialand account">
      <GlassCard className="mx-auto max-w-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--text)]">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-xl border border-[var(--primary)]/15 bg-white/60 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
            />
          </div>

          {mode === "register" && (
            <div>
              <label className="mb-1 block text-sm font-medium text-[var(--text)]">Username</label>
              <input
                type="text"
                required
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className="w-full rounded-xl border border-[var(--primary)]/15 bg-white/60 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
              />
            </div>
          )}

          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--text)]">Password</label>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-xl border border-[var(--primary)]/15 bg-white/60 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
            />
          </div>

          {error && (
            <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          )}

          <Button type="submit" disabled={loading}>
            {loading ? "Please wait..." : mode === "login" ? "Log in" : "Create account"}
          </Button>
        </form>

        <button
          type="button"
          onClick={() => setMode(mode === "login" ? "register" : "login")}
          className="mt-4 text-sm text-[var(--primary)] hover:underline"
        >
          {mode === "login" ? "Need an account? Register" : "Already have an account? Log in"}
        </button>
      </GlassCard>
    </PageLayout>
  );
}
