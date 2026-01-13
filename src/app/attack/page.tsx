import { RainbowTableDemo } from "@/components/rainbow-table-demo";

export default function AttackPage() {
  return (
    <div className="container mx-auto px-4 pb-16 pt-10 sm:px-6 md:px-8">
      <header className="space-y-3">
        <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Lab 02</p>
        <h1 className="text-3xl sm:text-4xl font-headline font-semibold">Attack Lab</h1>
        <p className="text-muted-foreground max-w-2xl">
          Explore rainbow tables, estimate search space costs, and see how weak hashes collapse under pressure.
        </p>
      </header>

      <section className="mt-8">
        <RainbowTableDemo />
      </section>
    </div>
  );
}
