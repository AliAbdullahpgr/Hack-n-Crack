# **App Name**: Hash & Crack

## Core Features:

- Hashing Playground: Allows users to input text and hash it using MD5, SHA-1, and SHA-256 algorithms.
- Advanced Hashing: Adds bcrypt and Argon2id with cost controls and timing benchmarks.
- Rainbow Table Demo: Demonstrates rainbow table attacks on MD5 hashes using a precomputed table.
- Algorithm Comparison: Provides a visual comparison of MD5, SHA-1, and SHA-256 algorithms, highlighting their security levels.
- Salt Option: Allows users to add salt to the hashing process, improving security.
- Hash Cracking Tool: If MD5 is selected for hashing and a user's entered text exists in a Rainbow Table, then notify the user of a successful hash 'crack'.
- Attack Estimator: Models dictionary vs brute force attack time and rainbow table size.
- Salt Simulator: Shows how different salts change hashes for the same input.
- Learning Walkthrough: Step-by-step guide for new users.
- Glossary + Scenarios: Quick references and real-world prompts.

## Style Guidelines:

- Primary color: Deep teal (#0F6E79) to signal clarity and trust.
- Background color: Warm paper (#FAF4E8) to keep the interface calm and readable.
- Accent color: Coral (#E86B50) for emphasis and interactive highlights.
- Headline font: 'Space Grotesk' (sans-serif); body font: 'Manrope' (sans-serif); code font: 'JetBrains Mono' (monospace).
- Use lock and key icons to represent security, plus scanning/alert motifs for attacks.
- Separate the Hashing Playground and Rainbow Table Demo as distinct lab sections.
- Use meaningful motion (fade-up reveals, floating ambient shapes) to create a dynamic, hands-on feel.
