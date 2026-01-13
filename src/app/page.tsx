import { HashingPlayground } from "@/components/hashing-playground";
import { RainbowTableDemo } from "@/components/rainbow-table-demo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Lock, ArrowRight, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <main className="relative">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 right-[-10%] h-72 w-72 rounded-full bg-accent/25 blur-3xl animate-float" />
        <div className="absolute top-24 left-[-8%] h-80 w-80 rounded-full bg-primary/15 blur-3xl animate-float" />
      </div>

      <div className="container mx-auto px-4 pb-16 pt-10 sm:px-6 md:px-8">
        <header className="relative z-10">
          <nav className="flex flex-wrap items-center justify-between gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2 font-semibold text-foreground">
              <Lock className="h-5 w-5 text-primary" />
              Hash & Crack
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <a href="#hashing">Hashing Lab</a>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <a href="#attack">Attack Lab</a>
              </Button>
            </div>
          </nav>

          <div className="mt-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-6">
              <Badge variant="secondary" className="w-fit">
                Security workshop
              </Badge>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-headline font-semibold tracking-tight">
                Hashes are silent. Attacks are not.
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl">
                Explore how hashing works, why salts matter, and how rainbow tables exploit weak choices. This lab is hands-on, fast, and designed to teach by doing.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button size="lg" className="gap-2" asChild>
                  <a href="#hashing">
                    Start hashing
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </Button>
                <Button variant="outline" size="lg" className="gap-2" asChild>
                  <a href="#attack">
                    See the attack
                    <Sparkles className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
            <div className="space-y-4">
              <div className="rounded-2xl border border-border bg-background/80 p-5 shadow-sm">
                <div className="text-sm text-muted-foreground">Lab snapshot</div>
                <div className="mt-4 grid gap-3">
                  <div className="flex items-center justify-between text-sm">
                    <span>Algorithms</span>
                    <span className="font-semibold text-foreground">MD5, SHA-1, SHA-256</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Salting</span>
                    <span className="font-semibold text-foreground">Optional, generated</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Attack demo</span>
                    <span className="font-semibold text-foreground">Rainbow lookup</span>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border border-dashed border-primary/40 bg-primary/5 p-5 text-sm text-muted-foreground">
                Tip: Click any hash in the rainbow table to load it instantly. Hash history results are one click away for copying.
              </div>
            </div>
          </div>
        </header>

        <section id="hashing" className="relative z-10 mt-16 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Lab 01</p>
              <h2 className="text-3xl sm:text-4xl font-headline font-semibold">Hashing Playground</h2>
            </div>
          </div>
          <HashingPlayground />
        </section>

        <section id="attack" className="relative z-10 mt-16 space-y-6">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Lab 02</p>
            <h2 className="text-3xl sm:text-4xl font-headline font-semibold">Rainbow Table Demo</h2>
          </div>
          <RainbowTableDemo />
        </section>

        <footer className="relative z-10 mt-16 text-sm text-muted-foreground">
          Built as a teaching lab. Hashing is not encryption.
        </footer>
      </div>
    </main>
  );
}
