"use client";

import { useState } from "react";
import { Copy, Wand2 } from "lucide-react";
import { getHash, generateSalt, type HashAlgorithm } from "@/lib/hashing";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const ALGORITHMS: HashAlgorithm[] = ["MD5", "SHA-1", "SHA-256"];

type SimResult = {
  plain: string;
  saltA: string;
  saltB: string;
};

export function SaltSimulator() {
  const [inputText, setInputText] = useState("password");
  const [saltA, setSaltA] = useState(generateSalt());
  const [saltB, setSaltB] = useState(generateSalt());
  const [algorithm, setAlgorithm] = useState<HashAlgorithm>("SHA-256");
  const [result, setResult] = useState<SimResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const { toast } = useToast();

  const runSimulation = async () => {
    if (!inputText) {
      toast({ title: "Input required", description: "Enter text to simulate salts.", variant: "destructive" });
      return;
    }
    setIsRunning(true);
    try {
      const plain = await getHash(algorithm, inputText);
      const hashA = await getHash(algorithm, inputText, { salt: saltA });
      const hashB = await getHash(algorithm, inputText, { salt: saltB });
      setResult({ plain, saltA: hashA, saltB: hashB });
    } catch {
      toast({ title: "Simulation failed", description: "Unable to calculate hashes.", variant: "destructive" });
    } finally {
      setIsRunning(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({ title: "Copied to clipboard!" });
    } catch {
      toast({ title: "Copy failed", description: "Clipboard access blocked.", variant: "destructive" });
    }
  };

  return (
    <Card className="bg-background/80">
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <Wand2 className="text-primary" />
          Salt Impact Simulator
        </CardTitle>
        <CardDescription>Same input, different salts, different hashes.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="salt-sim-input">Input</Label>
          <Input
            id="salt-sim-input"
            value={inputText}
            onChange={(event) => setInputText(event.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Algorithm</Label>
          <div className="flex flex-wrap gap-2">
            {ALGORITHMS.map((algo) => (
              <Button
                key={algo}
                type="button"
                variant={algorithm === algo ? "default" : "secondary"}
                size="sm"
                onClick={() => setAlgorithm(algo)}
              >
                {algo}
              </Button>
            ))}
          </div>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="salt-a">Salt A</Label>
            <div className="flex items-center gap-2">
              <Input id="salt-a" value={saltA} onChange={(event) => setSaltA(event.target.value)} className="font-mono" />
              <Button variant="ghost" size="icon" onClick={() => setSaltA(generateSalt())}>
                <Wand2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="salt-b">Salt B</Label>
            <div className="flex items-center gap-2">
              <Input id="salt-b" value={saltB} onChange={(event) => setSaltB(event.target.value)} className="font-mono" />
              <Button variant="ghost" size="icon" onClick={() => setSaltB(generateSalt())}>
                <Wand2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        <Button onClick={runSimulation} disabled={isRunning} className="gap-2">
          Run Simulation
        </Button>

        {result && (
          <div className="space-y-3 text-sm">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">No salt</span>
                <Button variant="ghost" size="icon" onClick={() => copyToClipboard(result.plain)}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="font-mono break-all">{result.plain}</p>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Salt A</span>
                <Button variant="ghost" size="icon" onClick={() => copyToClipboard(result.saltA)}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="font-mono break-all">{result.saltA}</p>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Salt B</span>
                <Button variant="ghost" size="icon" onClick={() => copyToClipboard(result.saltB)}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="font-mono break-all">{result.saltB}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
