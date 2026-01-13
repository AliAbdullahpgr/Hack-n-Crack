"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const terms = [
  {
    term: "Hash Function",
    definition: "A one-way function that maps input data to a fixed-size output. Small changes in input create very different outputs.",
  },
  {
    term: "Salt",
    definition: "Random data added to a password before hashing so that identical passwords do not share the same hash.",
  },
  {
    term: "Rainbow Table",
    definition: "A precomputed lookup table used to reverse weak hashes by matching them to common passwords.",
  },
  {
    term: "Work Factor",
    definition: "A configurable cost parameter that makes hashing slower and more expensive for attackers.",
  },
  {
    term: "Bcrypt",
    definition: "An adaptive password hashing algorithm that includes a built-in salt and adjustable cost.",
  },
  {
    term: "Argon2id",
    definition: "A modern, memory-hard algorithm that resists GPU attacks using time and memory costs.",
  },
];

export function Glossary() {
  return (
    <Accordion type="single" collapsible className="w-full">
      {terms.map((item) => (
        <AccordionItem key={item.term} value={item.term}>
          <AccordionTrigger>{item.term}</AccordionTrigger>
          <AccordionContent>{item.definition}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
