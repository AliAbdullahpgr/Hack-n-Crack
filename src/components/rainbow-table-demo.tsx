"use client";

import { useState } from "react";
import { KeyRound, Search, ShieldAlert, ShieldCheck, ShieldX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const rainbowTable = {
  "e10adc3949ba59abbe56e057f20f883e": "123456",
  "5f4dcc3b5aa765d61d8327deb882cf99": "password",
  "21232f297a57a5a743894a0e4a801fc3": "admin",
};

const comparisonData = [
    { algorithm: "MD5", length: "128-bit", speed: "Very Fast", security: "❌ Broken" },
    { algorithm: "SHA-1", length: "160-bit", speed: "Fast", security: "⚠️ Weak" },
    { algorithm: "SHA-256", length: "256-bit", speed: "Slower", security: "✅ Secure" },
];

export function RainbowTableDemo() {
  const [inputHash, setInputHash] = useState("e10adc3949ba59abbe56e057f20f883e");
  const [selectedAlgorithm, setSelectedAlgorithm] = useState("MD5");
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
    
    if (rainbowTable.hasOwnProperty(lowercasedHash)) {
      setCrackResult({ success: true, password: rainbowTable[lowercasedHash as keyof typeof rainbowTable] });
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
            <div className="space-y-2">
              <Label htmlFor="hash-input">Hash Value</Label>
              <Input
                id="hash-input"
                value={inputHash}
                onChange={(e) => setInputHash(e.target.value)}
                placeholder="Enter MD5 hash..."
                className="font-mono"
              />
            </div>
            <div className="space-y-2">
                <Label htmlFor="algo-select">Algorithm</Label>
                <Select value={selectedAlgorithm} onValueChange={setSelectedAlgorithm}>
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
                       {selectedAlgorithm !== 'MD5' 
                         ? `The rainbow table only works for MD5 in this demo.`
                         : 'Hash not found in this example rainbow table.'}
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
                     A tiny sample of what an attacker's table might look like for MD5.
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
                            <TableRow key={hash} onClick={() => setInputHash(hash)} className="cursor-pointer">
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
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Algorithm</TableHead>
                                <TableHead>Length</TableHead>
                                <TableHead>Speed</TableHead>
                                <TableHead>Security</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {comparisonData.map((item) => (
                                <TableRow key={item.algorithm}>
                                    <TableCell className="font-medium">{item.algorithm}</TableCell>
                                    <TableCell>{item.length}</TableCell>
                                    <TableCell>{item.speed}</TableCell>
                                    <TableCell>
                                        <span className="font-bold">{item.security}</span>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    </div>
  );
}
