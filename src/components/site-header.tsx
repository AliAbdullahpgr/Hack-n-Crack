"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Lock, Menu } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/hashing", label: "Hashing Lab" },
  { href: "/attack", label: "Attack Lab" },
  { href: "/learning", label: "Learning" },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/70 bg-background/80 backdrop-blur">
      <div className="container mx-auto flex items-center justify-between px-4 py-3 sm:px-6 md:px-8">
        <Link href="/" className="flex items-center gap-2 font-semibold text-foreground">
          <Lock className="h-5 w-5 text-primary" />
          Hash & Crack
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {navItems.map((item) => (
            <Button key={item.href} variant="ghost" size="sm" asChild>
              <Link
                href={item.href}
                className={cn(
                  pathname === item.href ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {item.label}
              </Link>
            </Button>
          ))}
          <Button variant="ghost" size="sm" asChild>
            <Link href="/learning#glossary" className={cn(pathname === "/learning" ? "text-foreground" : "text-muted-foreground")}>
              Glossary
            </Link>
          </Button>
          <ThemeToggle />
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Open navigation">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Navigate</SheetTitle>
              </SheetHeader>
              <div className="mt-6 flex flex-col gap-2">
                {navItems.map((item) => (
                  <Button key={item.href} variant="ghost" className="justify-start" asChild>
                    <Link href={item.href}>{item.label}</Link>
                  </Button>
                ))}
                <Button variant="ghost" className="justify-start" asChild>
                  <Link href="/learning#glossary">Glossary</Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
