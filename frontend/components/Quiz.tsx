"use client";

import { useState } from "react";
import Button from "@/components/Button";
import type { Question } from "@/lib/types";

type QuizProps = {
  title: string;
  questions: Question[];
};

export default function Quiz({ title, questions }: QuizProps) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);

  function selectAnswer(questionId: string, optionIndex: number) {
    if (submitted) return;
    setAnswers({ ...answers, [questionId]: optionIndex });
  }

  function handleSubmit() {
    setSubmitted(true);
  }

  const score = questions.filter((q) => answers[q.id] === q.correctIndex).length;

  return (
    <div>
      <h2 className="mb-6 text-lg font-semibold text-[var(--text)] sm:text-xl">{title}</h2>

      {questions.map((question, index) => (
        <div key={question.id} className="card-light mb-5 p-4 sm:p-5">
          <p className="mb-3 font-medium text-[var(--text)]">
            {index + 1}. {question.text}
          </p>
          <div className="space-y-2">
            {question.options.map((option, optionIndex) => {
              const isSelected = answers[question.id] === optionIndex;
              const isCorrect = optionIndex === question.correctIndex;

              let style = "border border-[var(--primary)]/15 bg-white/60 hover:bg-white/80 text-[var(--text)]";
              if (submitted && isCorrect) style = "border-green-300 bg-green-50";
              else if (submitted && isSelected && !isCorrect) style = "border-red-300 bg-red-50";
              else if (isSelected) style = "border-[var(--primary)] bg-[var(--primary-light)]";

              return (
                <button
                  key={optionIndex}
                  type="button"
                  onClick={() => selectAnswer(question.id, optionIndex)}
                  className={`block w-full rounded-xl p-3 text-left text-sm transition-colors ${style}`}
                >
                  {option}
                </button>
              );
            })}
          </div>
          {submitted && question.explanation && (
            <p className="mt-3 text-sm text-[var(--text-muted)]">{question.explanation}</p>
          )}
        </div>
      ))}

      {!submitted ? (
        <Button type="button" onClick={handleSubmit}>
          Submit Quiz
        </Button>
      ) : (
        <div className="card-light p-5 text-center">
          <p className="text-sm text-[var(--text-muted)]">Your score</p>
          <p className="text-2xl font-bold text-[var(--primary)] sm:text-3xl">
            {score} / {questions.length}
          </p>
        </div>
      )}
    </div>
  );
}
