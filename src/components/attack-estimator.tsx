"use client";

import { useMemo, useState } from "react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Bar, BarChart, XAxis, YAxis } from "recharts";

type Algorithm = "MD5" | "SHA-1" | "SHA-256";

const chartConfig = {
  space: { label: "Search space", color: "hsl(var(--primary))" },
};

const hashBytesByAlgorithm: Record<Algorithm, number> = {
  MD5: 16,
  "SHA-1": 20,
  "SHA-256": 32,
};

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes.toFixed(0)} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  const mb = kb / 1024;
  if (mb < 1024) return `${mb.toFixed(1)} MB`;
  const gb = mb / 1024;
  if (gb < 1024) return `${gb.toFixed(2)} GB`;
  const tb = gb / 1024;
  return `${tb.toFixed(2)} TB`;
}

function formatDurationFromLog10(log10Seconds: number) {
  if (log10Seconds <= 0) return "< 1 sec";
  if (log10Seconds < 6) {
    const seconds = Math.pow(10, log10Seconds);
    if (seconds < 60) return `${seconds.toFixed(1)} sec`;
    const minutes = seconds / 60;
    if (minutes < 60) return `${minutes.toFixed(1)} min`;
    const hours = minutes / 60;
    if (hours < 24) return `${hours.toFixed(1)} hrs`;
    const days = hours / 24;
    return `${days.toFixed(1)} days`;
  }
  if (log10Seconds < 12) {
    const seconds = Math.pow(10, log10Seconds);
    const years = seconds / (60 * 60 * 24 * 365);
    return `${years.toFixed(1)} years`;
  }
  return `~1e${log10Seconds.toFixed(1)} seconds`;
}

export function AttackEstimator({ algorithm }: { algorithm: Algorithm }) {
  const [mode, setMode] = useState<"dictionary" | "bruteforce">("dictionary");
  const [dictionarySize, setDictionarySize] = useState(1000000);
  const [guessRate, setGuessRate] = useState(1500000);
  const [passwordLength, setPasswordLength] = useState(10);
  const [alphabetSize, setAlphabetSize] = useState(52);
  const [avgPasswordLength, setAvgPasswordLength] = useState(10);

  const log10Guesses = useMemo(() => {
    if (mode === "dictionary") {
      return Math.log10(dictionarySize);
    }
    return passwordLength * Math.log10(alphabetSize);
  }, [mode, dictionarySize, passwordLength, alphabetSize]);

  const log10Seconds = log10Guesses - Math.log10(Math.max(guessRate, 1));

  const tableSizeBytes = useMemo(() => {
    const entryBytes = hashBytesByAlgorithm[algorithm] + avgPasswordLength;
    return dictionarySize * entryBytes;
  }, [algorithm, dictionarySize, avgPasswordLength]);

  const chartData = useMemo(() => {
    const lengths = [4, 6, 8, 10, 12];
    return lengths.map((length) => ({
      length: `${length}`,
      space: Number((length * Math.log10(alphabetSize)).toFixed(2)),
    }));
  }, [alphabetSize]);

  return (
    <Card className="bg-background/80">
      <CardHeader>
        <CardTitle className="font-headline">Attack Estimator</CardTitle>
        <CardDescription>Estimate cracking time and rainbow table size for {algorithm}.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs value={mode} onValueChange={(value) => setMode(value as "dictionary" | "bruteforce")}>
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="dictionary">Dictionary attack</TabsTrigger>
            <TabsTrigger value="bruteforce">Brute force</TabsTrigger>
          </TabsList>
          <TabsContent value="dictionary" className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Dictionary size</span>
                <Badge variant="secondary">{dictionarySize.toLocaleString()} entries</Badge>
              </div>
              <Slider
                min={10000}
                max={50000000}
                step={10000}
                value={[dictionarySize]}
                onValueChange={(value) => setDictionarySize(value[0] ?? 1000000)}
              />
            </div>
          </TabsContent>
          <TabsContent value="bruteforce" className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Password length</span>
                <Badge variant="secondary">{passwordLength} chars</Badge>
              </div>
              <Slider
                min={4}
                max={16}
                step={1}
                value={[passwordLength]}
                onValueChange={(value) => setPasswordLength(value[0] ?? 10)}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Alphabet size</span>
                <Badge variant="secondary">{alphabetSize} symbols</Badge>
              </div>
              <Slider
                min={10}
                max={94}
                step={1}
                value={[alphabetSize]}
                onValueChange={(value) => setAlphabetSize(value[0] ?? 52)}
              />
            </div>
          </TabsContent>
        </Tabs>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Guesses per second</span>
            <Badge variant="secondary">{guessRate.toLocaleString()} / sec</Badge>
          </div>
          <Slider
            min={1000}
            max={100000000}
            step={1000}
            value={[guessRate]}
            onValueChange={(value) => setGuessRate(value[0] ?? 1500000)}
          />
        </div>

        <div className="rounded-lg border border-border bg-background/70 p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Estimated time</span>
            <span className="font-semibold">{formatDurationFromLog10(log10Seconds)}</span>
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            Search space: 10^{log10Guesses.toFixed(2)} guesses
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Average password length in table</span>
            <Badge variant="secondary">{avgPasswordLength} chars</Badge>
          </div>
          <Slider
            min={6}
            max={20}
            step={1}
            value={[avgPasswordLength]}
            onValueChange={(value) => setAvgPasswordLength(value[0] ?? 10)}
          />
          <p className="text-xs text-muted-foreground">Estimated rainbow table size: {formatBytes(tableSizeBytes)}</p>
        </div>

        <div className="space-y-2">
          <div className="text-sm font-semibold">Search space growth (log10)</div>
          <ChartContainer config={chartConfig} className="h-[220px]">
            <BarChart data={chartData}>
              <XAxis dataKey="length" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="space" fill="var(--color-space)" radius={6} />
            </BarChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
