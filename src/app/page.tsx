import Link from "next/link";
import { ArrowRight, Sparkles, ShieldCheck, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 right-[-10%] h-72 w-72 rounded-full bg-accent/25 blur-3xl animate-float" />
        <div className="absolute top-24 left-[-8%] h-80 w-80 rounded-full bg-primary/15 blur-3xl animate-float" />
      </div>

      <div className="container mx-auto px-4 pb-16 pt-12 sm:px-6 md:px-8">
        <div className="relative z-10 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <Badge variant="secondary" className="w-fit">
              Security workshop
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-headline font-semibold tracking-tight">
              Hashes are silent. Attacks are not.
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              A multi-lab experience for hashing, salting, and attack modeling. Learn quickly, compare outcomes, and understand why weak hashes fail.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button size="lg" className="gap-2" asChild>
                <Link href="/hashing">
                  Start hashing
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="gap-2" asChild>
                <Link href="/attack">
                  See the attack
                  <Sparkles className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-border bg-background/80 p-5 shadow-sm">
              <div className="text-sm text-muted-foreground">Lab snapshot</div>
              <div className="mt-4 grid gap-3">
                <div className="flex items-center justify-between text-sm">
                  <span>Algorithms</span>
                  <span className="font-semibold text-foreground">MD5, SHA-1, SHA-256, bcrypt, Argon2id</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Salting</span>
                  <span className="font-semibold text-foreground">Optional + built-in</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Attack lab</span>
                  <span className="font-semibold text-foreground">Rainbow + estimator</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Benchmarks</span>
                  <span className="font-semibold text-foreground">Timing + cost</span>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-dashed border-primary/40 bg-primary/5 p-5 text-sm text-muted-foreground">
              Tip: Visit the learning path for a quick guided tour, then return to each lab to experiment.
            </div>
          </div>
        </div>

        <div className="relative z-10 mt-16 grid gap-6 lg:grid-cols-3">
          <Card className="bg-background/80">
            <CardHeader>
              <CardTitle className="font-headline flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                Hashing Lab
              </CardTitle>
              <CardDescription>Generate hashes, tune costs, and compare speeds.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" size="sm" asChild>
                <Link href="/hashing">Open hashing lab</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-background/80">
            <CardHeader>
              <CardTitle className="font-headline flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Attack Lab
              </CardTitle>
              <CardDescription>Rainbow tables and search space analysis.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" size="sm" asChild>
                <Link href="/attack">Open attack lab</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-background/80">
            <CardHeader>
              <CardTitle className="font-headline flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Learning Path
              </CardTitle>
              <CardDescription>Walkthrough, glossary, and scenarios.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" size="sm" asChild>
                <Link href="/learning">Open learning</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
