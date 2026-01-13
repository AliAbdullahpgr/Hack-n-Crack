"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type Section = {
  id: string;
  label: string;
};

export function SectionToc({
  sections,
  variant = "sidebar",
}: {
  sections: Section[];
  variant?: "sidebar" | "compact";
}) {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? "");

  useEffect(() => {
    const elements = sections
      .map((section) => document.getElementById(section.id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (!elements.length) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => (a.boundingClientRect.top > b.boundingClientRect.top ? 1 : -1));
        if (visible[0]) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: 0.1 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sections]);

  if (variant === "compact") {
    return (
      <div className="flex gap-2 overflow-x-auto pb-2">
        {sections.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            className={cn(
              "whitespace-nowrap rounded-full border px-3 py-1 text-xs font-semibold transition",
              activeId === section.id
                ? "border-primary bg-primary/10 text-primary"
                : "border-border bg-background/70 text-muted-foreground hover:text-foreground"
            )}
            aria-current={activeId === section.id ? "page" : undefined}
          >
            {section.label}
          </a>
        ))}
      </div>
    );
  }

  return (
    <aside className="rounded-2xl border border-border bg-background/80 p-4 text-sm">
      <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">On this page</div>
      <div className="mt-4 space-y-2">
        {sections.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            className={cn(
              "block rounded-md px-2 py-1 transition",
              activeId === section.id
                ? "bg-primary/10 text-primary font-semibold"
                : "text-muted-foreground hover:text-foreground"
            )}
            aria-current={activeId === section.id ? "page" : undefined}
          >
            {section.label}
          </a>
        ))}
      </div>
    </aside>
  );
}
