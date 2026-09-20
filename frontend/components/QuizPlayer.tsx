"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Button from "@/components/Button";
import { ApiError } from "@/lib/api/errors";
import { startQuizAttempt, submitQuizAttempt } from "@/lib/api/quizzes";
import { getStoredToken } from "@/lib/auth";
import type { GradedQuestion, QuizQuestion } from "@/lib/types";

type QuizPlayerProps = {
  quizId: string;
  title: string;
  questions: QuizQuestion[];
};

export default function QuizPlayer({ quizId, title, questions }: QuizPlayerProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [graded, setGraded] = useState<GradedQuestion[] | null>(null);
  const [score, setScore] = useState<{ score: number; total: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [needsLogin, setNeedsLogin] = useState(false);

  useEffect(() => {
    const token = getStoredToken();
    if (!token) {
      setNeedsLogin(true);
      return;
    }

    startQuizAttempt(quizId, token)
      .then((response) => setAttemptId(response.attemptId))
      .catch((err: unknown) => {
        if (err instanceof ApiError && err.statusCode === 401) {
          setNeedsLogin(true);
          return;
        }
        setError(err instanceof Error ? err.message : "Could not start quiz");
      });
  }, [quizId]);

  function selectAnswer(questionId: string, optionId: string) {
    if (graded) return;
    setAnswers((current) => ({ ...current, [questionId]: optionId }));
  }

  async function handleSubmit() {
    const token = getStoredToken();
    if (!token || !attemptId) {
      setNeedsLogin(true);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await submitQuizAttempt(
        quizId,
        attemptId,
        questions.map((question) => ({
          questionId: question.id,
          selectedOptionId: answers[question.id] ?? "",
        })),
        token,
      );
      setGraded(result.questions);
      setScore({ score: result.score, total: result.total });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not submit quiz");
    } finally {
      setLoading(false);
    }
  }

  const submitted = graded !== null;

  return (
    <div>
      <h2 className="mb-6 text-lg font-semibold text-[var(--text)] sm:text-xl">{title}</h2>

      {needsLogin && (
        <p className="mb-4 text-sm text-[var(--text-muted)]">
          <Link href="/login" className="font-medium text-[var(--primary)] hover:underline">
            Log in
          </Link>{" "}
          to save your progress and unlock levels.
        </p>
      )}

      {error && (
        <p className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {questions.map((question, index) => {
        const gradedQuestion = graded?.find((item) => item.id === question.id);

        return (
          <div key={question.id} className="card-light mb-5 p-4 sm:p-5">
            <p className="mb-3 font-medium text-[var(--text)]">
              {index + 1}. {question.text}
            </p>
            <div className="space-y-2">
              {(gradedQuestion?.options ?? question.options).map((option) => {
                const isSelected = answers[question.id] === option.id;
                const isCorrect =
                  gradedQuestion !== undefined &&
                  "isCorrect" in option &&
                  option.isCorrect;

                let style =
                  "border border-[var(--primary)]/15 bg-white/60 hover:bg-white/80 text-[var(--text)]";
                if (submitted && isCorrect) style = "border-green-300 bg-green-50";
                else if (submitted && isSelected && !isCorrect)
                  style = "border-red-300 bg-red-50";
                else if (isSelected)
                  style = "border-[var(--primary)] bg-[var(--primary-light)]";

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => selectAnswer(question.id, option.id)}
                    disabled={submitted || loading}
                    className={`block w-full rounded-xl p-3 text-left text-sm transition-colors ${style}`}
                  >
                    {option.text}
                  </button>
                );
              })}
            </div>
            {submitted && gradedQuestion?.explanation && (
              <p className="mt-3 text-sm text-[var(--text-muted)]">
                {gradedQuestion.explanation}
              </p>
            )}
          </div>
        );
      })}

      {!submitted ? (
        <Button type="button" onClick={handleSubmit} disabled={loading || (!attemptId && !needsLogin)}>
          {loading ? "Submitting..." : "Submit Quiz"}
        </Button>
      ) : score ? (
        <div className="card-light p-5 text-center">
          <p className="text-sm text-[var(--text-muted)]">Your score</p>
          <p className="text-2xl font-bold text-[var(--primary)] sm:text-3xl">
            {score.score} / {score.total}
          </p>
        </div>
      ) : null}
    </div>
  );
}
