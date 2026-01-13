import { LearningWalkthrough } from "@/components/learning-walkthrough";
import { Scenarios } from "@/components/scenarios";
import { Glossary } from "@/components/glossary";
import { LearningProgress } from "@/components/learning-progress";
import { KnowledgeCheck } from "@/components/knowledge-check";
import { Flashcards } from "@/components/flashcards";
import { LearningPrimer } from "@/components/learning-primer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function LearningPage() {
  return (
    <div className="container mx-auto px-4 pb-16 pt-10 sm:px-6 md:px-8">
      <header className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] items-start">
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Learning Path</p>
          <h1 className="text-3xl sm:text-4xl font-headline font-semibold">Learn the basics fast</h1>
          <p className="text-muted-foreground max-w-2xl">
            Follow a guided path, practice with flashcards, and validate with a knowledge check.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button className="gap-2" asChild>
              <Link href="#walkthrough">Start the walkthrough</Link>
            </Button>
            <Button variant="outline" className="gap-2" asChild>
              <Link href="#knowledge">Take the quiz</Link>
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            <Badge variant="secondary">4 modules</Badge>
            <Badge variant="secondary">Hands-on labs</Badge>
            <Badge variant="secondary">Flashcards + quiz</Badge>
          </div>
        </div>
        <div className="space-y-4">
          <LearningProgress variant="compact" />
          <Card className="bg-background/80">
            <CardHeader>
              <CardTitle className="font-headline">Quick links</CardTitle>
              <CardDescription>Jump straight to a lab or reference.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href="/hashing">Hashing lab</Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="/attack">Attack lab</Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="#glossary">Glossary</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </header>

      <section id="foundation" className="mt-12 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Foundation</p>
            <h2 className="text-2xl sm:text-3xl font-headline font-semibold">Core principles</h2>
            <p className="text-muted-foreground">Learn the three rules that drive safe password storage.</p>
          </div>
          <Badge variant="secondary">~15 min total</Badge>
        </div>
        <LearningPrimer />
      </section>

      <section id="walkthrough" className="mt-12 space-y-6">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Walkthrough</p>
          <h2 className="text-2xl sm:text-3xl font-headline font-semibold">Guided steps</h2>
          <p className="text-muted-foreground">Short, focused steps that build confidence quickly.</p>
        </div>
        <LearningWalkthrough />
      </section>

      <section id="checklist" className="mt-12 space-y-6">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Checklist</p>
          <h2 className="text-2xl sm:text-3xl font-headline font-semibold">Track your progress</h2>
          <p className="text-muted-foreground">Check off each lab as you finish it.</p>
        </div>
        <LearningProgress />
      </section>

      <section id="practice" className="mt-12 space-y-6">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Practice</p>
          <h2 className="text-2xl sm:text-3xl font-headline font-semibold">Review and validate</h2>
          <p className="text-muted-foreground">Use flashcards to review, then prove it on the quiz.</p>
        </div>
        <div className="space-y-8">
          <div id="flashcards">
            <Flashcards />
          </div>
          <div id="knowledge">
            <KnowledgeCheck />
          </div>
        </div>
      </section>

      <section id="scenarios" className="mt-12 space-y-3">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Scenarios</p>
          <h2 className="text-2xl sm:text-3xl font-headline font-semibold">Real-world scenarios</h2>
          <p className="text-muted-foreground">Practice selecting the right algorithm and cost.</p>
        </div>
        <Scenarios />
      </section>

      <section id="glossary" className="mt-12 space-y-3">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Reference</p>
          <h2 className="text-2xl sm:text-3xl font-headline font-semibold">Glossary</h2>
          <p className="text-muted-foreground">Key terms, short and memorable.</p>
        </div>
        <Glossary />
      </section>
    </div>
  );
}
