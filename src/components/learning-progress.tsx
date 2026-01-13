"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type Task = {
  id: string;
  title: string;
  detail: string;
  href: string;
  group: "Foundations" | "Labs" | "Practice";
  minutes: number;
};

const TASKS: Task[] = [
  {
    id: "hash-two",
    title: "Hash one input with two algorithms",
    detail: "Compare output length and formatting.",
    href: "/hashing",
    group: "Foundations",
    minutes: 3,
  },
  {
    id: "toggle-salt",
    title: "Toggle salt and compare outputs",
    detail: "Notice how one character changes the entire hash.",
    href: "/hashing#salt-sim",
    group: "Foundations",
    minutes: 4,
  },
  {
    id: "benchmark",
    title: "Run a benchmark",
    detail: "Observe how cost and time change with bcrypt/Argon2id.",
    href: "/hashing",
    group: "Labs",
    minutes: 4,
  },
  {
    id: "rainbow-attack",
    title: "Crack a hash with the rainbow table",
    detail: "Use a known MD5 hash and test the lookup.",
    href: "/attack",
    group: "Labs",
    minutes: 4,
  },
  {
    id: "estimator",
    title: "Estimate brute force time",
    detail: "Explore how search space explodes with length.",
    href: "/attack",
    group: "Labs",
    minutes: 4,
  },
  {
    id: "flashcards",
    title: "Flip through the flashcards",
    detail: "Review key terms fast.",
    href: "/learning#flashcards",
    group: "Practice",
    minutes: 3,
  },
  {
    id: "quiz",
    title: "Complete the knowledge check",
    detail: "Validate the fundamentals.",
    href: "/learning#knowledge",
    group: "Practice",
    minutes: 4,
  },
  {
    id: "scenario",
    title: "Pick a real-world scenario",
    detail: "Choose an algorithm and justify the cost.",
    href: "/learning#scenarios",
    group: "Practice",
    minutes: 4,
  },
  {
    id: "glossary",
    title: "Scan the glossary",
    detail: "Lock in the core definitions.",
    href: "/learning#glossary",
    group: "Practice",
    minutes: 2,
  },
];

const STORAGE_KEY = "hash-learning-progress";

const GROUPS: Array<{ id: Task["group"]; label: string }> = [
  { id: "Foundations", label: "Foundations" },
  { id: "Labs", label: "Hands-on labs" },
  { id: "Practice", label: "Practice" },
];

export function LearningProgress({ variant = "full" }: { variant?: "full" | "compact" }) {
  const [completed, setCompleted] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setCompleted(JSON.parse(stored) as Record<string, boolean>);
      } catch {
        setCompleted({});
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(completed));
  }, [completed]);

  const completedCount = useMemo(
    () => TASKS.filter((task) => completed[task.id]).length,
    [completed]
  );

  const percent = TASKS.length ? (completedCount / TASKS.length) * 100 : 0;
  const nextTask = TASKS.find((task) => !completed[task.id]);
  const remainingMinutes = useMemo(
    () => TASKS.filter((task) => !completed[task.id]).reduce((sum, task) => sum + task.minutes, 0),
    [completed]
  );
  const totalMinutes = useMemo(
    () => TASKS.reduce((sum, task) => sum + task.minutes, 0),
    []
  );

  return (
    <Card className="bg-background/80">
      <CardHeader>
        <CardTitle className="font-headline">Learning progress</CardTitle>
        <CardDescription>Track your hands-on checkpoints.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Completed</span>
            <span className="font-semibold">
              {completedCount}/{TASKS.length}
            </span>
          </div>
          <Progress value={percent} />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Time left</span>
            <span>{remainingMinutes} min of {totalMinutes} min</span>
          </div>
        </div>

        {variant === "compact" ? (
          <div className="space-y-3 text-sm">
            <div className="rounded-lg border border-border bg-background/70 p-3">
              <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Next up</div>
              <div className="mt-2 font-semibold text-foreground">
                {nextTask ? nextTask.title : "All tasks completed"}
              </div>
              <p className="text-muted-foreground">
                {nextTask ? nextTask.detail : "Nice work. Review the quiz or scenarios next."}
              </p>
              {nextTask && (
                <Button variant="outline" size="sm" className="mt-3" asChild>
                  <Link href={nextTask.href}>Continue</Link>
                </Button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/learning#checklist">View checklist</Link>
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setCompleted({})}>
                Reset progress
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-5 text-sm">
              {GROUPS.map((group) => {
                const groupTasks = TASKS.filter((task) => task.group === group.id);
                const groupDone = groupTasks.filter((task) => completed[task.id]).length;
                return (
                  <div key={group.id} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">{group.label}</Badge>
                      <span className="text-xs text-muted-foreground">
                        {groupDone}/{groupTasks.length} done
                      </span>
                    </div>
                    <div className="space-y-3">
                      {groupTasks.map((task) => (
                        <div key={task.id} className="grid gap-3 rounded-lg border border-border/70 bg-background/70 p-3 md:grid-cols-[auto_1fr_auto]">
                          <Checkbox
                            id={task.id}
                            checked={Boolean(completed[task.id])}
                            onCheckedChange={(checked) =>
                              setCompleted((prev) => ({
                                ...prev,
                                [task.id]: Boolean(checked),
                              }))
                            }
                          />
                          <div className="space-y-1">
                            <label htmlFor={task.id} className="cursor-pointer font-medium text-foreground">
                              {task.title}
                            </label>
                            <div className="text-muted-foreground">{task.detail}</div>
                          </div>
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={task.href}>Open</Link>
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-wrap gap-2">
              {nextTask && (
                <Button variant="outline" size="sm" asChild>
                  <Link href={nextTask.href}>Continue: {nextTask.title}</Link>
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={() => setCompleted({})}>
                Reset progress
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
