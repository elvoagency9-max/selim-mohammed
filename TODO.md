# Matasersh Phase One TODO

## Camera and image intake

- [x] The home screen presents Matasersh as a zero-search cooking assistant for busy developers and parents.
- [x] The primary action opens a camera/image intake flow that supports taking a fridge or pantry photo and choosing an existing photo when camera access is unavailable.
- [x] The intake state gives clear progress feedback while the image is being interpreted and provides a fallback sample state in Preview.

## Editable ingredient review

- [x] After intake, the app shows a vision-prototype list of detected ingredients.
- [x] Users can remove detected ingredients, add a missing ingredient, and continue only with the confirmed list.
- [x] The list is presented as pantry-style chips and remains readable in a one-handed portrait layout.

## Structured zero-search recipes

- [x] Recipe generation uses the confirmed available ingredients as its primary input and returns a structured result with title, total time, ingredient quantities, concise steps, and realistic servings.
- [x] The flow includes strict “5-minute emergency” and “15-minute sprint” time modes, with the selected mode visible in the result.
- [x] The result includes ingredient substitution suggestions for missing or impractical items.
- [x] Recipe presentation is action-oriented and optimized for quick scanning and immediate cooking.

## Phase-one boundaries and delivery

- [x] Voice interaction, read-aloud cooking mode, dietary filters, expiration tracking, grocery integration, and speed-refinement work remain out of scope for this phase.
- [x] The fixed Expo/React Native/TypeScript/NativeWind starter, generated identifiers, and safe-area providers remain intact.
- [x] Native branding assets are present at the starter's required image paths before checkpointing.

## Verification evidence

The implemented project passes `pnpm check` and `pnpm lint`. The Expo web listener and API listener respond on their fixed starter ports, and the mobile-sized Preview was visually inspected at 390×844. The structured substitution result is rendered dynamically from `recipe.substitutions`.
