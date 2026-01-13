"use client";

import { useState } from "react";
import { KeyRound, Search, ShieldAlert, ShieldCheck, ShieldX, Radar, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const rainbowTable: Record<string, string> = {
  "e10adc3949ba59abbe56e057f20f883e": "123456",
  "5f4dcc3b5aa765d61d8327deb882cf99": "password",
  "21232f297a57a5a743894a0e4a801fc3": "admin",
};

type Algorithm = "MD5" | "SHA-1" | "SHA-256";

const comparisonData = [
  { algorithm: "MD5", length: "128-bit", speed: "Very Fast", security: "Broken", tone: "bg-red-500/15 text-red-700" },
  { algorithm: "SHA-1", length: "160-bit", speed: "Fast", security: "Weak", tone: "bg-amber-500/15 text-amber-700" },
  { algorithm: "SHA-256", length: "256-bit", speed: "Slower", security: "Strong", tone: "bg-emerald-500/15 text-emerald-700" },
];

export function RainbowTableDemo() {
  const [inputHash, setInputHash] = useState("e10adc3949ba59abbe56e057f20f883e");
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<Algorithm>("MD5");
  const [crackResult, setCrackResult] = useState<{ success: boolean; password?: string } | null>(null);
  const { toast } = useToast();

  const handleCrack = () => {
    if (!inputHash) {
      toast({ title: "Input required", description: "Please enter a hash value to crack.", variant: "destructive" });
      return;
    }

    const lowercasedHash = inputHash.toLowerCase().trim();

    if (selectedAlgorithm !== "MD5") {
      setCrackResult({ success: false });
      return;
    }

    if (Object.prototype.hasOwnProperty.call(rainbowTable, lowercasedHash)) {
      setCrackResult({ success: true, password: rainbowTable[lowercasedHash] });
    } else {
      setCrackResult({ success: false });
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
              <KeyRound className="text-primary" />
              Rainbow Table Attack
            </CardTitle>
            <CardDescription>
              Try to crack a hash using a pre-computed rainbow table.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="gap-1">
                <Radar className="h-3.5 w-3.5" />
                Precomputed lookup
              </Badge>
              <Badge variant="secondary" className="gap-1">
                <Zap className="h-3.5 w-3.5" />
                Instant crack for weak hashes
              </Badge>
            </div>
            <div className="space-y-2">
              <Label htmlFor="hash-input">Hash Value</Label>
              <Input
                id="hash-input"
                value={inputHash}
                onChange={(e) => {
                  setInputHash(e.target.value);
                  setCrackResult(null);
                }}
                placeholder="Enter MD5 hash..."
                className="font-mono"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {Object.entries(rainbowTable).map(([hash, password]) => (
                <Button
                  key={hash}
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setInputHash(hash);
                    setCrackResult(null);
                  }}
                >
                  {password}
                </Button>
              ))}
            </div>
            <div className="space-y-2">
              <Label htmlFor="algo-select">Algorithm</Label>
              <Select
                value={selectedAlgorithm}
                onValueChange={(value) => {
                  setSelectedAlgorithm(value as Algorithm);
                  setCrackResult(null);
                }}
              >
                <SelectTrigger id="algo-select">
                  <SelectValue placeholder="Select algorithm" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MD5">MD5</SelectItem>
                  <SelectItem value="SHA-1">SHA-1</SelectItem>
                  <SelectItem value="SHA-256">SHA-256</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleCrack} className="w-full">
              <Search className="mr-2 h-4 w-4" />
              Crack Hash
            </Button>
            {crackResult !== null && (
              <div className="mt-4 animate-in fade-in duration-300">
                {crackResult.success ? (
                  <Alert variant="destructive">
                    <ShieldAlert className="h-4 w-4" />
                    <AlertTitle>Hash Cracked!</AlertTitle>
                    <AlertDescription>
                      Password found: <span className="font-bold font-mono">{crackResult.password}</span>
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Alert>
                    <ShieldCheck className="h-4 w-4" />
                    <AlertTitle>Crack Failed</AlertTitle>
                    <AlertDescription>
                      {selectedAlgorithm !== "MD5"
                        ? "The rainbow table only works for MD5 in this demo."
                        : "Hash not found in this example rainbow table."}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}
            <Alert variant="default" className="mt-4 bg-primary/10 border-primary/20">
              <ShieldAlert className="h-4 w-4 text-primary" />
              <AlertTitle className="text-primary">How this works</AlertTitle>
              <AlertDescription>
                This demo uses a small "rainbow table" for common passwords. If the hash you enter is in our table, we can instantly find the original password. This is why weak, unsalted hashes like MD5 are insecure.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
              <ShieldX className="text-destructive" />
              Example Rainbow Table
            </CardTitle>
            <CardDescription>
              A tiny sample of what an attacker's table might look like for MD5. Click a row to load it.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Password</TableHead>
                  <TableHead className="font-mono">MD5 Hash</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(rainbowTable).map(([hash, password]) => (
                  <TableRow
                    key={hash}
                    onClick={() => {
                      setInputHash(hash);
                      setCrackResult(null);
                    }}
                    className="cursor-pointer"
                  >
                    <TableCell>{password}</TableCell>
                    <TableCell className="font-mono text-xs">{hash}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Algorithm Comparison</CardTitle>
          <CardDescription>Why SHA-256 is the safer choice for passwords.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {comparisonData.map((item) => (
              <div key={item.algorithm} className="rounded-lg border border-border bg-background/70 p-4">
                <div className="flex items-center justify-between">
                  <div className="font-semibold">{item.algorithm}</div>
                  <span className={cn("rounded-full px-2 py-1 text-xs font-semibold", item.tone)}>
                    {item.security}
                  </span>
                </div>
                <div className="mt-3 space-y-1 text-sm text-muted-foreground">
                  <div>Length: <span className="text-foreground">{item.length}</span></div>
                  <div>Speed: <span className="text-foreground">{item.speed}</span></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
