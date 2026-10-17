export type TimeMode = "5-minute emergency" | "15-minute sprint";

export type Substitution = {
  from: string;
  to: string;
};

export type Recipe = {
  title: string;
  time: string;
  servings: string;
  ingredients: string[];
  steps: string[];
  substitutions: Substitution[];
};

const baseIngredients = ["eggs", "stale bread", "chili flakes", "spinach"];

export function detectIngredientsFromPhoto(_uri?: string): string[] {
  return [...baseIngredients];
}

export function generateRecipe(ingredients: string[], mode: TimeMode): Recipe {
  const has = (name: string) => ingredients.some((item) => item.toLowerCase().includes(name));
  const eggCount = has("egg") ? "2 eggs" : "1/2 cup chickpea flour + 1/3 cup water";
  const bread = has("bread") ? "2 slices stale bread, torn" : "1 small tortilla, torn";
  const greens = has("spinach") ? "1 generous handful spinach" : "1/2 cup frozen peas";
  const time = mode === "5-minute emergency" ? "5 min" : "15 min";

  return {
    title: mode === "5-minute emergency" ? "Crispy Chili Egg Toast" : "Skillet Pantry Panzanella",
    time,
    servings: "Serves 1 hungry cook",
    ingredients: [
      eggCount,
      bread,
      greens,
      has("chili") ? "1/2 tsp chili flakes" : "1/2 tsp hot sauce",
      "1 tbsp olive oil",
      "Salt + black pepper",
    ],
    steps:
      mode === "5-minute emergency"
        ? [
            "Warm olive oil in a skillet over medium-high heat.",
            "Add torn bread and chili flakes; toast until crisp at the edges, about 90 seconds.",
            "Push bread aside, crack in the eggs, and fold in spinach until just wilted.",
            "Season boldly. Slide into a bowl and eat while hot.",
          ]
        : [
            "Toast the torn bread in olive oil until deeply golden, then set aside.",
            "Wilt the greens in the same skillet with a pinch of salt.",
            "Add the eggs and gently scramble until barely set.",
            "Fold the crisp bread back in, finish with chili, pepper, and a final drizzle of oil.",
          ],
    substitutions: [
      { from: "Eggs", to: "Chickpea flour batter" },
      { from: "Spinach", to: "Frozen peas or any soft greens" },
      { from: "Stale bread", to: "Torn tortilla or cooked rice" },
    ],
  };
}
