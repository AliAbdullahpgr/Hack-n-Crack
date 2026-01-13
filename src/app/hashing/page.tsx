import { HashingPlayground } from "@/components/hashing-playground";
import { SaltSimulator } from "@/components/salt-simulator";

export default function HashingPage() {
  return (
    <div className="container mx-auto px-4 pb-16 pt-10 sm:px-6 md:px-8">
      <header className="space-y-3">
        <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Lab 01</p>
        <h1 className="text-3xl sm:text-4xl font-headline font-semibold">Hashing Playground</h1>
        <p className="text-muted-foreground max-w-2xl">
          Experiment with modern and legacy hashing algorithms, adjust costs, and see how salts change outcomes.
        </p>
      </header>

      <section id="hashing" className="mt-8">
        <HashingPlayground />
      </section>

      <section id="salt-sim" className="mt-12">
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Lab 01B</p>
          <h2 className="text-2xl sm:text-3xl font-headline font-semibold">Salt Impact Simulator</h2>
        </div>
        <div className="mt-4">
          <SaltSimulator />
        </div>
      </section>
    </div>
  );
}
