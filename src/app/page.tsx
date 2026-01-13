import { HashingPlayground } from "@/components/hashing-playground";
import { RainbowTableDemo } from "@/components/rainbow-table-demo";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Lock } from "lucide-react";

export default function Home() {
  return (
    <main className="container mx-auto p-4 sm:p-6 md:p-8">
      <header className="text-center mb-8">
        <div className="inline-flex items-center gap-3">
          <Lock className="h-10 w-10 text-primary" />
          <h1 className="text-4xl sm:text-5xl font-headline font-bold tracking-tight">
            Hash & Crack
          </h1>
        </div>
        <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">
          An interactive playground to understand hashing algorithms, security, and vulnerabilities like rainbow table attacks.
        </p>
      </header>
      
      <Tabs defaultValue="playground" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-6">
          <TabsTrigger value="playground">Hashing Playground</TabsTrigger>
          <TabsTrigger value="rainbow">Rainbow Table Demo</TabsTrigger>
        </TabsList>
        <TabsContent value="playground">
          <HashingPlayground />
        </TabsContent>
        <TabsContent value="rainbow">
          <RainbowTableDemo />
        </TabsContent>
      </Tabs>
    </main>
  );
}
