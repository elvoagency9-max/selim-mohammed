# Matasersh Phase One Plan

## Scope

Phase one delivers the core AI and vision prototype from the brief: a mobile-first intake flow for a fridge or pantry photo, vision-style ingredient detection, editable ingredient confirmation, structured recipe generation, strict time modes, and practical substitutions. Voice interaction, read-aloud cooking mode, dietary filters, expiration tracking, grocery integration, and latency optimization remain out of scope.

## Implementation approach

The fixed Expo Router / React Native / TypeScript / NativeWind starter remains intact. The primary `(tabs)/index.tsx` route becomes the Matasersh home and prototype flow. `expo-image-picker` provides camera capture and photo-library fallback on native devices and a web-safe picker path in Preview. A local deterministic vision-prototype adapter turns a captured image into an editable ingredient list, making the interaction demonstrable without putting provider keys in the client. The recipe generator maps confirmed ingredients and the selected time mode into a typed recipe object with title, time, servings, ingredients, steps, and substitution suggestions. The UI makes the detected list editable before generation and keeps a sample recipe available for preview when no camera is available.

## Project structure

- `app/(tabs)/index.tsx`: Matasersh phase-one state machine and screens: intake, ingredient review, and recipe result.
- `app/(tabs)/_layout.tsx`: single-tab navigation with the Matasersh brand treatment.
- `components/screen-container.tsx`: existing safe-area shell, reused unchanged.
- `lib/recipe-prototype.ts`: typed local prototype logic for vision result normalization and structured recipe generation.
- `assets/images/*`: native brand icon files, preserving the starter's required Expo asset paths.
- `app.config.ts`: Matasersh identity and logo metadata, preserving generated bundle identifiers.
- `TODO.md`: outcome-based delivery checklist for the approved scope.

## Design direction

Three possible directions were considered: **0.06 — editorial pantry notebook**, **0.04 — soft neo-brutalist kitchen console**, and **0.08 — warm utility interface with citrus accents**. The chosen direction is the warm utility interface.

### Design Movement

A warm, tactile kitchen utility aesthetic: paper-like surfaces, bold ink typography, citrus color signals, and compact action controls inspired by recipe cards and pantry labels.

### Core Principles

1. Make the next action unmistakable within one glance.
2. Treat imperfect ingredients as useful starting points, not failures.
3. Keep the interaction forgiving and editable before any recipe is generated.
4. Use time as the primary organizing signal for busy cooks.

### Color Philosophy

A deep ink navy anchors trust and readability; warm cream creates a calm, low-glare canvas; paprika coral marks primary action; lemon yellow signals quick modes; and sage green communicates detected ingredients and practical confidence.

### Layout Paradigm

A top-weighted, thumb-friendly vertical flow with an offset hero card, a horizontal time-mode rail, and stacked content cards. The layout avoids dense grids and keeps the main CTA close to the bottom of the screen.

### Signature Elements

- An oversized coral camera button with a small “zero-search” badge.
- Ingredient chips styled like pantry labels, with clear remove affordances.
- Recipe result cards with a vertical time rail and “swap this” substitution callouts.

### Interaction Philosophy

Every state has one dominant action: capture, confirm, or cook. Secondary actions stay quiet but available. Captured ingredients are always editable, and the prototype gives clear progress copy rather than pretending that vision is instantaneous.

### Animation

Use short 180–240ms opacity and translate transitions between prototype states. Buttons compress slightly on press. Keep motion sparse and functional so a rushed parent or distracted developer can scan without waiting.

### Typography System

Use the starter system sans for reliable native rendering. Pair heavy display weights for the Matasersh wordmark and recipe title with medium body text and compact uppercase labels for time and state metadata.

### Brand Essence

Matasersh turns whatever is already in reach into a realistic next meal. Personality: inventive, grounded, brisk.

### Brand Voice

Headlines sound direct and lightly playful; CTAs use verbs; microcopy reassures without overexplaining. Examples: “Show me the chaos.” and “Keep the ingredients. Lose the searching.”

### Wordmark & Logo

A compact wordmark with a sliced citrus dot over the “i” and a small offset pantry-label underline. The bundled icon uses a coral field, cream bowl shape, and navy spark mark.

### Signature Brand Color

Paprika coral `#F05D4E` is the ownable action color: energetic enough to prompt movement, warm enough to feel edible, and distinct from generic app blues.

## Data shape

```ts
 type Recipe = {
   title: string;
   time: string;
   servings: string;
   ingredients: string[];
   steps: string[];
   substitutions: { from: string; to: string }[];
 };
```

The prototype adapter is deliberately local and deterministic so phase one can be previewed without external API setup. It is structured to be replaced by a server-side multimodal LLM call in the next implementation increment without changing the UI contract.
