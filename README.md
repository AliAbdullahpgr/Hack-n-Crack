# Hash & Crack

Hands-on hashing and attack modeling labs built with Next.js. The app guides learners through hashing algorithms, salting, rainbow table concepts, and basic attack cost estimation with interactive UI panels.

## Features
- Hashing Playground: MD5, SHA-1, SHA-256, bcrypt, and Argon2id with tunable cost controls.
- Salt Impact Simulator: compare hashes with and without salts.
- Rainbow Table Demo: visualize how weak hashes get matched.
- Attack Estimator: rough comparisons for dictionary vs brute force search space.
- Learning Path: walkthrough, glossary, flashcards, and a knowledge check.

## Tech Stack
- Next.js 15 + React 19
- TypeScript
- Tailwind CSS + Radix UI primitives
- Genkit SDK (Google AI plugin) for future AI flows

## Getting Started
```bash
npm install
npm run dev
```
Then open `http://localhost:9002`.

## Scripts
- `npm run dev`: start Next.js with Turbopack on port 9002
- `npm run build`: production build
- `npm run start`: run the production build
- `npm run lint`: lint with Next.js defaults
- `npm run typecheck`: TypeScript type check
- `npm run genkit:dev`: start Genkit dev server
- `npm run genkit:watch`: start Genkit dev server with watch mode

## Project Structure
- `src/app/page.tsx`: landing page and lab entry points
- `src/app/hashing/page.tsx`: Hashing Playground + Salt Simulator
- `src/app/attack/page.tsx`: Attack Lab with Rainbow Table demo
- `src/app/learning/page.tsx`: Learning path and references
- `src/components`: lab panels and UI sections
- `src/lib/hashing.ts`: hashing helpers and algorithm options
- `docs/blueprint.md`: product blueprint and design notes

## Architecture
- Pages route users into three labs: hashing, attack, and learning.
- Each lab page composes focused feature components from `src/components`.
- Hashing logic is centralized in `src/lib/hashing.ts` and shared across labs.
- UI primitives live in `src/components/ui` and are composed into lab panels.

## Screenshots
Add screenshots once the UI is finalized.
```text
screenshots/
  home.png
  hashing-lab.png
  attack-lab.png
  learning-path.png
```

## Deployment
Choose one of the following.

### Vercel
```bash
npm run build
```
Deploy the repo in Vercel; the default Next.js settings work out of the box.

### Firebase App Hosting
1) Install and login to Firebase CLI.
2) Create or select a Firebase project.
3) Deploy using your existing `apphosting.yaml`.

```bash
npm run build
firebase deploy
```

## Notes
- The hashing utilities rely on Web Crypto for SHA algorithms and browser-friendly libraries for bcrypt and Argon2id.
- The app is currently client-focused with no required environment variables.
