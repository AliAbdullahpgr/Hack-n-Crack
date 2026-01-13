"use client";

import { useCallback, useEffect, useState } from "react";
import { Copy, Wand2, Shield, Sparkles, Timer, Download, Share2, Hash } from "lucide-react";
import { getHash, generateSalt, type HashAlgorithm } from "@/lib/hashing";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

type Algorithm = HashAlgorithm;

type HashResult = {
  algorithm: Algorithm;
  hash: string;
  lengthBits?: number;
  lengthChars: number;
  salt: string | null;
  saltNote: string;
  input: string;
  durationMs: number;
};

type BenchmarkRow = {
  algorithm: Algorithm;
  durationMs: number;
};

type Strength = {
  label: "Weak" | "Fair" | "Strong";
  score: number;
  description: string;
};

const ALGO_DETAILS: Record<Algorithm, { bits?: number; security: string; color: string; borderColor: string }> = {
  MD5: { bits: 128, security: "insecure", color: "bg-red-500 hover:bg-red-500/90", borderColor: "border-red-500/50" },
  "SHA-1": { bits: 160, security: "weak", color: "bg-yellow-500 hover:bg-yellow-500/90", borderColor: "border-yellow-500/50" },
  "SHA-256": { bits: 256, security: "secure", color: "bg-emerald-500 hover:bg-emerald-500/90", borderColor: "border-emerald-500/50" },
  Bcrypt: { security: "adaptive", color: "bg-sky-500 hover:bg-sky-500/90", borderColor: "border-sky-500/50" },
  Argon2id: { security: "modern", color: "bg-indigo-500 hover:bg-indigo-500/90", borderColor: "border-indigo-500/50" },
};

const QUICK_INPUTS = ["password", "letmein", "correct horse battery staple", "Tr0ub4dor&3"];
const ALGORITHMS: Algorithm[] = ["MD5", "SHA-1", "SHA-256", "Bcrypt", "Argon2id"];
const HISTORY_KEY = "hash-lab-history";

const getStrength = (text: string): Strength => {
  if (!text) {
    return { label: "Weak", score: 0, description: "Start typing to see strength." };
  }
  let score = 0;
  if (text.length >= 8) score += 1;
  if (text.length >= 12) score += 1;
  if (/[A-Z]/.test(text)) score += 1;
  if (/[0-9]/.test(text)) score += 1;
  if (/[^A-Za-z0-9]/.test(text)) score += 1;

  if (score <= 2) {
    return { label: "Weak", score, description: "Short or predictable input." };
  }
  if (score <= 4) {
    return { label: "Fair", score, description: "Add length or more character types." };
  }
  return { label: "Strong", score, description: "Harder to guess, still use a salt." };
};

function toFilenameSafe(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function HashingPlayground() {
  const [inputText, setInputText] = useState("password");
  const [useSalt, setUseSalt] = useState(false);
  const [salt, setSalt] = useState("");
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<Algorithm>("SHA-256");
  const [hashResult, setHashResult] = useState<HashResult | null>(null);
  const [isHashing, setIsHashing] = useState(false);
  const [history, setHistory] = useState<HashResult[]>([]);
  const [benchmarks, setBenchmarks] = useState<BenchmarkRow[]>([]);
  const [bcryptRounds, setBcryptRounds] = useState(10);
  const [argonMemory, setArgonMemory] = useState(19456);
  const [argonTime, setArgonTime] = useState(3);
  const [argonParallelism, setArgonParallelism] = useState(1);
  const { toast } = useToast();

  const strength = getStrength(inputText);
  const algorithmMeta = ALGO_DETAILS[selectedAlgorithm];
  const needsSalt = selectedAlgorithm === "Bcrypt" || selectedAlgorithm === "Argon2id";

  const handleHash = useCallback(async () => {
    if (!inputText) {
      toast({
        title: "Input required",
        description: "Please enter some text to hash.",
        variant: "destructive",
      });
      return;
    }

    setIsHashing(true);
    setHashResult(null);

    try {
      let saltToUse = useSalt ? salt : "";
      let saltNote = "No salt";
      if (useSalt) {
        if (!saltToUse) {
          saltToUse = generateSalt();
          setSalt(saltToUse);
        }
        saltNote = "User-provided salt";
      } else if (needsSalt) {
        saltToUse = generateSalt();
        saltNote = "Built-in salt (auto)";
      }

      const start = performance.now();
      const hash = await getHash(selectedAlgorithm, inputText, {
        salt: saltToUse,
        bcryptRounds,
        argon2: {
          memoryKb: argonMemory,
          time: argonTime,
          parallelism: argonParallelism,
        },
      });
      const durationMs = performance.now() - start;
      const details = ALGO_DETAILS[selectedAlgorithm];
      const result: HashResult = {
        algorithm: selectedAlgorithm,
        hash,
        lengthBits: details.bits,
        lengthChars: hash.length,
        salt: saltToUse || null,
        saltNote,
        input: inputText,
        durationMs,
      };

      setHashResult(result);
      setHistory((prev) => [result, ...prev].slice(0, 10));
    } catch (error) {
      toast({
        title: "Hashing failed",
        description: "Your browser could not complete the hash request.",
        variant: "destructive",
      });
    } finally {
      setIsHashing(false);
    }
  }, [
    inputText,
    toast,
    useSalt,
    salt,
    needsSalt,
    selectedAlgorithm,
    bcryptRounds,
    argonMemory,
    argonTime,
    argonParallelism,
  ]);

  useEffect(() => {
    const stored = localStorage.getItem(HISTORY_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as HashResult[];
        setHistory(parsed);
      } catch {
        setHistory([]);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;
      if (target.closest("input, textarea, [contenteditable='true']")) return;

      if (event.key === "1") setSelectedAlgorithm("MD5");
      if (event.key === "2") setSelectedAlgorithm("SHA-1");
      if (event.key === "3") setSelectedAlgorithm("SHA-256");
      if (event.key === "4") setSelectedAlgorithm("Bcrypt");
      if (event.key === "5") setSelectedAlgorithm("Argon2id");
      if (event.key.toLowerCase() === "h") void handleHash();
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleHash]);

  const runBenchmark = async () => {
    if (!inputText) {
      toast({
        title: "Input required",
        description: "Please enter some text to benchmark.",
        variant: "destructive",
      });
      return;
    }

    setIsHashing(true);
    setBenchmarks([]);
    try {
      const rows: BenchmarkRow[] = [];
      for (const algorithm of ALGORITHMS) {
        const saltToUse = useSalt ? salt || generateSalt() : algorithm === "Bcrypt" || algorithm === "Argon2id" ? generateSalt() : "";
        const start = performance.now();
        await getHash(algorithm, inputText, {
          salt: saltToUse,
          bcryptRounds,
          argon2: {
            memoryKb: argonMemory,
            time: argonTime,
            parallelism: argonParallelism,
          },
        });
        const durationMs = performance.now() - start;
        rows.push({ algorithm, durationMs });
      }
      setBenchmarks(rows);
    } catch (error) {
      toast({
        title: "Benchmark failed",
        description: "One of the algorithms could not complete the run.",
        variant: "destructive",
      });
    } finally {
      setIsHashing(false);
    }
  };

  const copyToClipboard = async (text: string, label = "Copied to clipboard!") => {
    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error("Clipboard unavailable");
      }
      await navigator.clipboard.writeText(text);
      toast({ title: label });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Your browser blocked clipboard access.",
        variant: "destructive",
      });
    }
  };

  const exportHistory = () => {
    if (!history.length) {
      toast({ title: "No history to export" });
      return;
    }
    const blob = new Blob([JSON.stringify(history, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `hash-history-${toFilenameSafe(new Date().toISOString())}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const shareHistory = async () => {
    if (!history.length) {
      toast({ title: "No history to share" });
      return;
    }
    const payload = JSON.stringify(history, null, 2);
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Hash history",
          text: payload,
        });
        return;
      } catch {
        // fall through to copy
      }
    }
    await copyToClipboard(payload, "History copied to clipboard!");
  };

  return (
    <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-8">
      <Card className="backdrop-blur">
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2">
            <Wand2 className="text-primary" />
            Hashing Playground
          </CardTitle>
          <CardDescription>
            Explore one-way hashing with adaptive algorithms and optional salt.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="text-input">Text or Password</Label>
            <Input
              id="text-input"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Enter text..."
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Strength</span>
              <Badge
                variant="outline"
                className={cn(
                  "border-transparent",
                  strength.label === "Weak" && "bg-red-500/15 text-red-600",
                  strength.label === "Fair" && "bg-amber-500/15 text-amber-700",
                  strength.label === "Strong" && "bg-emerald-500/15 text-emerald-700"
                )}
              >
                {strength.label}
              </Badge>
            </div>
            <Progress value={(strength.score / 5) * 100} />
            <p className="text-xs text-muted-foreground">{strength.description}</p>
          </div>
          <div className="space-y-2">
            <Label>Quick Inputs</Label>
            <div className="flex flex-wrap gap-2">
              {QUICK_INPUTS.map((preset) => (
                <Button
                  key={preset}
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setInputText(preset)}
                >
                  {preset}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Algorithm</Label>
            <div className="flex flex-wrap gap-2">
              {ALGORITHMS.map((algorithm) => (
                <Button
                  key={algorithm}
                  type="button"
                  variant={selectedAlgorithm === algorithm ? "default" : "secondary"}
                  size="sm"
                  onClick={() => setSelectedAlgorithm(algorithm)}
                >
                  {algorithm}
                </Button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">Shortcut keys: 1-5 select algorithms, H to hash.</p>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="use-salt"
              checked={useSalt}
              onCheckedChange={(checked) => setUseSalt(Boolean(checked))}
            />
            <Label htmlFor="use-salt">Add Salt</Label>
          </div>
          {useSalt && (
            <div className="space-y-2 animate-in fade-in duration-300">
              <Label htmlFor="salt-input">Salt (auto-generated if empty)</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="salt-input"
                  value={salt}
                  onChange={(e) => setSalt(e.target.value)}
                  placeholder="Enter salt or let us generate one"
                  className="font-code"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSalt(generateSalt())}
                  aria-label="Generate salt"
                >
                  <Wand2 className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">Salt is combined with the password before hashing to prevent rainbow table attacks.</p>
            </div>
          )}
          {!useSalt && needsSalt && (
            <p className="text-xs text-muted-foreground">
              {selectedAlgorithm} always uses a built-in salt even when "Add Salt" is off.
            </p>
          )}

          {selectedAlgorithm === "Bcrypt" && (
            <div className="space-y-2 rounded-lg border border-border bg-background/70 p-4">
              <Label>Bcrypt Cost (rounds)</Label>
              <Slider
                min={6}
                max={14}
                step={1}
                value={[bcryptRounds]}
                onValueChange={(value) => setBcryptRounds(value[0] ?? 10)}
              />
              <div className="text-xs text-muted-foreground">Current rounds: {bcryptRounds}</div>
            </div>
          )}
          {selectedAlgorithm === "Argon2id" && (
            <div className="space-y-3 rounded-lg border border-border bg-background/70 p-4">
              <div className="space-y-2">
                <Label>Memory (KB)</Label>
                <Slider
                  min={8192}
                  max={65536}
                  step={1024}
                  value={[argonMemory]}
                  onValueChange={(value) => setArgonMemory(value[0] ?? 19456)}
                />
                <div className="text-xs text-muted-foreground">Current memory: {argonMemory} KB</div>
              </div>
              <div className="space-y-2">
                <Label>Time Cost</Label>
                <Slider
                  min={1}
                  max={6}
                  step={1}
                  value={[argonTime]}
                  onValueChange={(value) => setArgonTime(value[0] ?? 3)}
                />
                <div className="text-xs text-muted-foreground">Current iterations: {argonTime}</div>
              </div>
              <div className="space-y-2">
                <Label>Parallelism</Label>
                <Slider
                  min={1}
                  max={4}
                  step={1}
                  value={[argonParallelism]}
                  onValueChange={(value) => setArgonParallelism(value[0] ?? 1)}
                />
                <div className="text-xs text-muted-foreground">Current lanes: {argonParallelism}</div>
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            <Button onClick={handleHash} disabled={isHashing} className="gap-2">
              <Hash className="h-4 w-4" />
              Generate Hash
            </Button>
            <Button onClick={runBenchmark} disabled={isHashing} variant="outline" className="gap-2">
              <Timer className="h-4 w-4" />
              Run Benchmark
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card className={cn("min-h-[320px]", hashResult ? algorithmMeta.borderColor : "border-dashed")}>
          {isHashing ? (
            <div className="h-full flex items-center justify-center p-10">
              <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                <p className="text-muted-foreground">Generating Hash...</p>
              </div>
            </div>
          ) : hashResult ? (
            <>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="font-headline flex items-center gap-2">
                      <Shield />
                      Hash Result
                    </CardTitle>
                    <CardDescription>Using {hashResult.algorithm}</CardDescription>
                  </div>
                  <Badge variant="outline" className={cn("capitalize text-white", algorithmMeta.borderColor, algorithmMeta.color)}>
                    {algorithmMeta.security}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Input Text</Label>
                  <div className="flex items-start gap-2">
                    <p className="flex-1 font-mono text-sm p-2 bg-muted rounded-md break-all">{hashResult.input}</p>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => copyToClipboard(hashResult.input, "Input copied")}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {hashResult.salt && (
                  <div className="space-y-2">
                    <Label>Salt Used</Label>
                    <div className="flex items-start gap-2">
                      <p className="flex-1 font-mono text-sm p-2 bg-muted rounded-md break-all">{hashResult.salt}</p>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => copyToClipboard(hashResult.salt ?? "", "Salt copied")}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">{hashResult.saltNote}</p>
                  </div>
                )}
                <div className="space-y-2">
                  <Label>Generated Hash</Label>
                  <div className="relative">
                    <p className="font-mono text-sm p-3 pr-10 bg-muted rounded-md break-all">{hashResult.hash}</p>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-1/2 right-1 -translate-y-1/2 h-8 w-8"
                      onClick={() => copyToClipboard(hashResult.hash)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm pt-2">
                  <div>
                    <p className="text-muted-foreground">Algorithm</p>
                    <p className="font-semibold">{hashResult.algorithm}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Hash Length</p>
                    <p className="font-semibold">
                      {hashResult.lengthBits ? `${hashResult.lengthBits} bits` : "Adaptive"} ({hashResult.lengthChars} chars)
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Time to Hash</p>
                    <p className="font-semibold">{hashResult.durationMs.toFixed(1)} ms</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Salt Strategy</p>
                    <p className="font-semibold">{hashResult.salt ? "Yes" : "No"}</p>
                  </div>
                </div>
              </CardContent>
            </>
          ) : (
            <div className="h-full flex items-center justify-center p-10">
              <p className="text-muted-foreground">Your hash result will appear here.</p>
            </div>
          )}
        </Card>

        <Accordion type="multiple" defaultValue={["history"]} className="space-y-3">
          <AccordionItem value="history" className="rounded-xl border border-border bg-background/70 px-4">
            <AccordionTrigger className="font-headline text-base">
              <span className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-accent" />
                Recent Hashes
              </span>
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              <p className="text-sm text-muted-foreground mb-3">Click any entry to copy its hash.</p>
              {history.length === 0 ? (
                <p className="text-sm text-muted-foreground">No hashes yet. Generate one to populate history.</p>
              ) : (
                <div className="space-y-2">
                  {history.map((entry, index) => (
                    <button
                      key={`${entry.hash}-${index}`}
                      type="button"
                      onClick={() => copyToClipboard(entry.hash)}
                      className="w-full rounded-md border border-border bg-background/70 px-3 py-2 text-left text-xs font-mono transition hover:border-primary"
                    >
                      <span className="text-muted-foreground">{entry.algorithm}:</span>{" "}
                      {entry.hash}
                    </button>
                  ))}
                </div>
              )}
              <div className="mt-3 flex flex-wrap gap-2">
                <Button variant="outline" size="sm" className="gap-2" onClick={exportHistory}>
                  <Download className="h-4 w-4" />
                  Export JSON
                </Button>
                <Button variant="outline" size="sm" className="gap-2" onClick={shareHistory}>
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="benchmark" className="rounded-xl border border-border bg-background/70 px-4">
            <AccordionTrigger className="font-headline text-base">
              <span className="flex items-center gap-2">
                <Timer className="h-4 w-4 text-primary" />
                Benchmark Panel
              </span>
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              <p className="text-sm text-muted-foreground mb-3">Compare hashing time across algorithms with your current settings.</p>
              {benchmarks.length === 0 ? (
                <p className="text-sm text-muted-foreground">Run a benchmark to see timings.</p>
              ) : (
                <div className="space-y-2">
                  {benchmarks.map((row) => (
                    <div key={row.algorithm} className="flex items-center justify-between text-sm">
                      <span className="font-semibold">{row.algorithm}</span>
                      <span className="font-mono">{row.durationMs.toFixed(1)} ms</span>
                    </div>
                  ))}
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
