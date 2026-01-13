"use client";

import { useState } from "react";
import { Copy, Wand2, Shield, Sparkles } from "lucide-react";
import { getHash, generateSalt } from "@/lib/hashing";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

type Algorithm = "MD5" | "SHA-1" | "SHA-256";

type HashResult = {
  algorithm: Algorithm;
  hash: string;
  lengthBits: number;
  lengthChars: number;
  salt: string | null;
  input: string;
};

type Strength = {
  label: "Weak" | "Fair" | "Strong";
  score: number;
  description: string;
};

const ALGO_DETAILS = {
  MD5: { bits: 128, security: "insecure", color: "bg-red-500 hover:bg-red-500/90", borderColor: "border-red-500/50" },
  "SHA-1": { bits: 160, security: "weak", color: "bg-yellow-500 hover:bg-yellow-500/90", borderColor: "border-yellow-500/50" },
  "SHA-256": { bits: 256, security: "secure", color: "bg-green-500 hover:bg-green-500/90", borderColor: "border-green-500/50" },
};

const QUICK_INPUTS = ["password", "letmein", "correct horse battery staple", "Tr0ub4dor&3"];

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

export function HashingPlayground() {
  const [inputText, setInputText] = useState("password");
  const [useSalt, setUseSalt] = useState(false);
  const [salt, setSalt] = useState("");
  const [hashResult, setHashResult] = useState<HashResult | null>(null);
  const [isHashing, setIsHashing] = useState(false);
  const [history, setHistory] = useState<HashResult[]>([]);
  const { toast } = useToast();
  const strength = getStrength(inputText);

  const handleHash = async (algorithm: Algorithm) => {
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
      let currentSalt: string | null = null;
      if (useSalt) {
        currentSalt = salt || generateSalt();
        if (!salt) {
          setSalt(currentSalt);
        }
      } else if (salt) {
        setSalt("");
      }

      // A small delay to make the loading state visible
      await new Promise((resolve) => setTimeout(resolve, 300));

      const hash = await getHash(algorithm, inputText, currentSalt || "");
      const details = ALGO_DETAILS[algorithm];
      const result = {
        algorithm,
        hash,
        lengthBits: details.bits,
        lengthChars: hash.length,
        salt: currentSalt,
        input: inputText,
      };
      setHashResult(result);
      setHistory((prev) => [result, ...prev].slice(0, 5));
    } catch (error) {
      toast({
        title: "Hashing failed",
        description: "Your browser could not complete the hash request.",
        variant: "destructive",
      });
    } finally {
      setIsHashing(false);
    }
  };
  
  const copyToClipboard = async (text: string) => {
    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error("Clipboard unavailable");
      }
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied to clipboard!",
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Your browser blocked clipboard access.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2">
            <Wand2 className="text-primary" />
            Hashing Playground
          </CardTitle>
          <CardDescription>
            See how hashing algorithms transform your text. Hashing is a one-way process.
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
          <div className="flex items-center space-x-2">
            <Checkbox id="use-salt" checked={useSalt} onCheckedChange={(checked) => setUseSalt(Boolean(checked))} />
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <Button onClick={() => handleHash("MD5")} disabled={isHashing}>Hash with MD5</Button>
            <Button onClick={() => handleHash("SHA-1")} disabled={isHashing}>Hash with SHA-1</Button>
            <Button onClick={() => handleHash("SHA-256")} disabled={isHashing}>Hash with SHA-256</Button>
          </div>
        </CardContent>
      </Card>

      <div className="min-h-[300px] flex items-center justify-center">
        {isHashing ? (
          <Card className="w-full h-full flex items-center justify-center bg-transparent border-dashed">
              <div className="flex flex-col items-center gap-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  <p className="text-muted-foreground">Generating Hash...</p>
              </div>
          </Card>
        ) : hashResult ? (
          <Card className={cn("w-full animate-in fade-in duration-500", ALGO_DETAILS[hashResult.algorithm].borderColor)}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="font-headline flex items-center gap-2">
                    <Shield />
                    Hash Result
                  </CardTitle>
                  <CardDescription>Using {hashResult.algorithm}</CardDescription>
                </div>
                <Badge variant="outline" className={cn("capitalize text-white", ALGO_DETAILS[hashResult.algorithm].borderColor, ALGO_DETAILS[hashResult.algorithm].color)}>
                  {ALGO_DETAILS[hashResult.algorithm].security}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Input Text</Label>
                <p className="font-mono text-sm p-2 bg-muted rounded-md break-all">{hashResult.input}</p>
              </div>
               {hashResult.salt && (
                <div className="space-y-2">
                  <Label>Salt Used</Label>
                  <p className="font-mono text-sm p-2 bg-muted rounded-md break-all">{hashResult.salt}</p>
                </div>
              )}
              <div className="space-y-2">
                <Label>Generated Hash</Label>
                <div className="relative">
                  <p className="font-mono text-sm p-3 pr-10 bg-muted rounded-md break-all">{hashResult.hash}</p>
                  <Button variant="ghost" size="icon" className="absolute top-1/2 right-1 -translate-y-1/2 h-8 w-8" onClick={() => copyToClipboard(hashResult.hash)}>
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
                      <p className="font-semibold">{hashResult.lengthBits} bits ({hashResult.lengthChars} chars)</p>
                  </div>
              </div>
              {history.length > 0 && (
                <div className="pt-2">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <Sparkles className="h-4 w-4 text-accent" />
                    Recent hashes
                  </div>
                  <div className="mt-2 space-y-2">
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
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
            <Card className="w-full h-full flex items-center justify-center bg-transparent border-dashed">
                <p className="text-muted-foreground">Your hash result will appear here.</p>
            </Card>
        )}
      </div>
    </div>
  );
}
