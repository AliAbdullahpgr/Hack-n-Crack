"use client";

import { useState } from "react";
import { Shuffle, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type Flashcard = {
  term: string;
  definition: string;
  tip: string;
};

const CARDS: Flashcard[] = [
  {
    term: "Hash",
    definition: "A fixed-size output produced from any input using a one-way function.",
    tip: "Same input always produces the same hash.",
  },
  {
    term: "Salt",
    definition: "Random data added to the input before hashing.",
    tip: "Prevents identical passwords from sharing hashes.",
  },
  {
    term: "Work factor",
    definition: "A cost parameter that makes hashing slower and more expensive to compute.",
    tip: "Higher cost slows attackers but also slows logins.",
  },
  {
    term: "Rainbow table",
    definition: "A precomputed table of hashes mapped to common passwords.",
    tip: "Effective against unsalted hashes.",
  },
  {
    term: "Argon2id",
    definition: "A modern memory-hard hashing algorithm designed to resist GPU attacks.",
    tip: "Tune memory, time, and parallelism.",
  },
  {
    term: "Bcrypt",
    definition: "An adaptive hashing algorithm with an adjustable cost parameter.",
    tip: "Use a higher cost as hardware improves.",
  },
  {
    term: "SHA-256",
    definition: "A widely used hash function that outputs 256-bit hashes.",
    tip: "Great for integrity, not ideal for passwords alone.",
  },
  {
    term: "MD5",
    definition: "A fast legacy hash with known collisions.",
    tip: "Avoid for passwords; too easy to crack.",
  },
  {
    term: "Collision",
    definition: "Two different inputs producing the same hash output.",
    tip: "Good hash functions make collisions extremely unlikely.",
  },
  {
    term: "Brute force",
    definition: "Trying all possible combinations until a match is found.",
    tip: "Search space grows exponentially with length.",
  },
  {
    term: "Dictionary attack",
    definition: "Trying common passwords and leaked wordlists first.",
    tip: "Effective against weak or reused passwords.",
  },
  {
    term: "Pepper",
    definition: "A secret value stored separately and added to the input.",
    tip: "Adds an extra layer beyond per-user salts.",
  },
];

function shuffleArray<T>(items: T[]) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function Flashcards() {
  const [order, setOrder] = useState(() => CARDS.map((_, index) => index));
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const card = CARDS[order[index] ?? 0];

  const nextCard = () => {
    setIndex((prev) => (prev + 1) % order.length);
    setFlipped(false);
  };

  const prevCard = () => {
    setIndex((prev) => (prev - 1 + order.length) % order.length);
    setFlipped(false);
  };

  const shuffle = () => {
    setOrder(shuffleArray(order));
    setIndex(0);
    setFlipped(false);
  };

  return (
    <Card className="bg-background/80">
      <CardHeader>
        <CardTitle className="font-headline">Flashcards</CardTitle>
        <CardDescription>Quickly review the key terms.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="flex items-center justify-between text-sm">
          <Badge variant="secondary">
            Card {index + 1} / {order.length}
          </Badge>
          <Button variant="ghost" size="sm" onClick={shuffle} className="gap-2">
            <Shuffle className="h-4 w-4" />
            Shuffle
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setFlipped((prev) => !prev)}
          className="w-full min-h-[320px] rounded-2xl border border-border bg-background/70 p-10 text-left transition hover:border-primary"
        >
          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            {flipped ? "Definition" : "Term"}
          </div>
          <div className="mt-4 text-3xl sm:text-4xl font-headline">
            {flipped ? card.definition : card.term}
          </div>
          <div className="mt-4 text-sm text-muted-foreground">{card.tip}</div>
          <div className="mt-6 text-xs text-muted-foreground">Tap to flip</div>
        </button>

        <div className="flex items-center justify-between">
          <Button variant="outline" size="sm" className="gap-2" onClick={prevCard}>
            <ChevronLeft className="h-4 w-4" />
            Prev
          </Button>
          <Button variant="outline" size="sm" className="gap-2" onClick={nextCard}>
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
