"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Question = {
  id: string;
  prompt: string;
  options: { id: string; label: string }[];
  correctId: string;
  explanation: string;
};

const QUESTIONS: Question[] = [
  {
    id: "q1",
    prompt: "What is the primary property of a cryptographic hash?",
    options: [
      { id: "a", label: "It is reversible with a key" },
      { id: "b", label: "It is one-way and deterministic" },
      { id: "c", label: "It always encrypts the input" },
      { id: "d", label: "It outputs the same size as the input" },
    ],
    correctId: "b",
    explanation: "Hashes are deterministic and one-way, which is why they are used for verification.",
  },
  {
    id: "q2",
    prompt: "Why are salts used in password hashing?",
    options: [
      { id: "a", label: "To make hashes reversible" },
      { id: "b", label: "To reduce storage size" },
      { id: "c", label: "To prevent identical passwords from sharing hashes" },
      { id: "d", label: "To increase encryption strength" },
    ],
    correctId: "c",
    explanation: "Salts make identical inputs produce different hashes, defeating rainbow tables.",
  },
  {
    id: "q3",
    prompt: "Which algorithm is considered legacy or broken for passwords?",
    options: [
      { id: "a", label: "Argon2id" },
      { id: "b", label: "Bcrypt" },
      { id: "c", label: "MD5" },
      { id: "d", label: "SHA-256" },
    ],
    correctId: "c",
    explanation: "MD5 is fast and collision-prone, making it unsafe for passwords.",
  },
  {
    id: "q4",
    prompt: "What does a higher bcrypt cost do?",
    options: [
      { id: "a", label: "Reduces hash length" },
      { id: "b", label: "Makes hashing slower and more expensive" },
      { id: "c", label: "Removes the salt" },
      { id: "d", label: "Makes it reversible" },
    ],
    correctId: "b",
    explanation: "Higher cost means more work per hash, slowing attackers.",
  },
  {
    id: "q5",
    prompt: "Why is Argon2id often recommended for passwords?",
    options: [
      { id: "a", label: "It is the fastest hash" },
      { id: "b", label: "It is memory-hard and configurable" },
      { id: "c", label: "It outputs plain text" },
      { id: "d", label: "It uses no salt" },
    ],
    correctId: "b",
    explanation: "Argon2id balances memory-hardness and tunable cost.",
  },
  {
    id: "q6",
    prompt: "What is a rainbow table?",
    options: [
      { id: "a", label: "A database of encrypted passwords" },
      { id: "b", label: "A set of precomputed hashes for common passwords" },
      { id: "c", label: "A GPU acceleration technique" },
      { id: "d", label: "A type of encryption algorithm" },
    ],
    correctId: "b",
    explanation: "Rainbow tables match hashes to known plaintexts quickly.",
  },
];

export function KnowledgeCheck() {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const score = useMemo(() => {
    return QUESTIONS.filter((question) => answers[question.id] === question.correctId).length;
  }, [answers]);

  return (
    <Card className="bg-background/80">
      <CardHeader>
        <CardTitle className="font-headline">Knowledge check</CardTitle>
        <CardDescription>Answer the questions to lock in the basics.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <Badge variant="secondary">Score</Badge>
          <span className="font-semibold">{score}/{QUESTIONS.length}</span>
          {submitted && (
            <span className="text-muted-foreground">
              {score === QUESTIONS.length ? "Perfect score." : "Review the explanations below."}
            </span>
          )}
        </div>

        {QUESTIONS.map((question, index) => {
          const selected = answers[question.id];
          const isCorrect = selected === question.correctId;
          return (
            <div key={question.id} className="rounded-xl border border-border bg-background/70 p-4">
              <div className="text-sm font-semibold">
                {index + 1}. {question.prompt}
              </div>
              <RadioGroup
                value={selected}
                onValueChange={(value) =>
                  setAnswers((prev) => ({ ...prev, [question.id]: value }))
                }
                className="mt-3"
              >
                {question.options.map((option) => {
                  const optionId = `${question.id}-${option.id}`;
                  const showState = submitted && selected === option.id;
                  return (
                    <label
                      key={option.id}
                      className={cn(
                        "flex items-center gap-2 rounded-md border border-transparent p-2 transition",
                        showState && (isCorrect ? "bg-emerald-500/10" : "bg-red-500/10")
                      )}
                    >
                      <RadioGroupItem id={optionId} value={option.id} />
                      <Label htmlFor={optionId}>{option.label}</Label>
                    </label>
                  );
                })}
              </RadioGroup>
              {submitted && (
                <p className={cn("mt-3 text-sm", isCorrect ? "text-emerald-600" : "text-red-600")}>
                  {isCorrect ? "Correct." : "Not quite."} {question.explanation}
                </p>
              )}
            </div>
          );
        })}

        <div className="flex flex-wrap gap-2">
          <Button onClick={() => setSubmitted(true)}>Check answers</Button>
          <Button
            variant="ghost"
            onClick={() => {
              setAnswers({});
              setSubmitted(false);
            }}
          >
            Reset quiz
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
