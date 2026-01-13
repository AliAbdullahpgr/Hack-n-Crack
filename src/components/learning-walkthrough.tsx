"use client";

import Link from "next/link";
import { BookOpen, Target, ShieldCheck, MoveRight, Sparkles } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const steps = [
  {
    title: "Hashing basics",
    description: "Run your first hash, compare outputs, and learn why hashing is one-way.",
    duration: "3 min",
    outcomes: ["One-way vs reversible", "Output length intuition"],
    icon: BookOpen,
    href: "/hashing",
  },
  {
    title: "Salt impact",
    description: "See how the same password becomes unrecognizable with different salts.",
    duration: "4 min",
    outcomes: ["Why salts stop reuse", "Same input, different output"],
    icon: ShieldCheck,
    href: "/hashing#salt-sim",
  },
  {
    title: "Attack lab",
    description: "Try the rainbow table attack and explore search space size.",
    duration: "5 min",
    outcomes: ["Rainbow tables", "Search space growth"],
    icon: Target,
    href: "/attack",
  },
  {
    title: "Apply it",
    description: "Use real-world scenarios to choose the right algorithm and cost.",
    duration: "4 min",
    outcomes: ["Tuning cost", "Migration strategy"],
    icon: Sparkles,
    href: "/learning#scenarios",
  },
];

export function LearningWalkthrough() {
  return (
    <div className="space-y-4">
      {steps.map((step, index) => (
        <Card key={step.title} className="bg-background/80">
          <CardHeader className="flex flex-col gap-4 md:flex-row md:items-start">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
              {index + 1}
            </div>
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <CardTitle className="font-headline flex items-center gap-2">
                  <step.icon className="h-5 w-5 text-primary" />
                  {step.title}
                </CardTitle>
                <Badge variant="secondary">{step.duration}</Badge>
                {index === 0 && <Badge variant="outline">Start here</Badge>}
              </div>
              <CardDescription>{step.description}</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {step.outcomes.map((outcome) => (
                <Badge key={outcome} variant="outline">
                  {outcome}
                </Badge>
              ))}
            </div>
            <Button variant="outline" size="sm" className="gap-2" asChild>
              <Link href={step.href}>
                Open step
                <MoveRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
