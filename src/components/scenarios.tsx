"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldAlert, ShieldCheck, Server, UserCheck } from "lucide-react";

const scenarios = [
  {
    title: "Breach response",
    description: "User database leaked. How do you reduce impact?",
    recommendation: "Use Argon2id or bcrypt with high cost and unique salts per user.",
    icon: ShieldAlert,
  },
  {
    title: "API keys at rest",
    description: "You must store secrets without reversible encryption.",
    recommendation: "Hash secrets with strong, unique salts and rotate regularly.",
    icon: Server,
  },
  {
    title: "Login friction",
    description: "Balance security with sign-in speed.",
    recommendation: "Tune cost to keep sign-in under 200ms on target devices.",
    icon: UserCheck,
  },
  {
    title: "Legacy system",
    description: "Old MD5 hashes still exist in production.",
    recommendation: "Rehash on login with a modern algorithm and migrate over time.",
    icon: ShieldCheck,
  },
];

export function Scenarios() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {scenarios.map((scenario) => (
        <Card key={scenario.title} className="bg-background/80">
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
              <scenario.icon className="h-5 w-5 text-primary" />
              {scenario.title}
            </CardTitle>
            <CardDescription>{scenario.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{scenario.recommendation}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
