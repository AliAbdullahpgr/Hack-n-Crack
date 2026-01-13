"use client";

import { ShieldCheck, LockKeyhole, Timer } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const primer = [
  {
    title: "Hashing is one-way",
    description: "You can verify data with a hash, but you cannot reverse it back to the original input.",
    icon: LockKeyhole,
  },
  {
    title: "Salts block reuse",
    description: "Salts make identical passwords hash to different outputs, breaking rainbow tables.",
    icon: ShieldCheck,
  },
  {
    title: "Cost is security",
    description: "Slow, memory-hard hashing makes large-scale cracking expensive.",
    icon: Timer,
  },
];

export function LearningPrimer() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {primer.map((item) => (
        <Card key={item.title} className="bg-background/80">
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
              <item.icon className="h-5 w-5 text-primary" />
              {item.title}
            </CardTitle>
            <CardDescription>{item.description}</CardDescription>
          </CardHeader>
          <CardContent />
        </Card>
      ))}
    </div>
  );
}
