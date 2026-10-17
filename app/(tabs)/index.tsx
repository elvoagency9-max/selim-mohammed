import * as ImagePicker from "expo-image-picker";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { ScreenContainer } from "@/components/screen-container";
import {
  detectIngredientsFromPhoto,
  generateRecipe,
  type Recipe,
  type TimeMode,
} from "@/lib/recipe-prototype";

type Stage = "capture" | "review" | "recipe";

const coral = "#F05D4E";
const ink = "#162A36";
const muted = "#6E7C7A";
const line = "#E8DED1";
const sage = "#B6D2B5";
const yellow = "#F7D66A";

export default function HomeScreen() {
  const [stage, setStage] = useState<Stage>("capture");
  const [mode, setMode] = useState<TimeMode>("5-minute emergency");
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [newIngredient, setNewIngredient] = useState("");
  const [photoUri, setPhotoUri] = useState<string | undefined>();
  const [busy, setBusy] = useState(false);
  const [recipe, setRecipe] = useState<Recipe | undefined>();

  const modeLabel = useMemo(
    () => (mode === "5-minute emergency" ? "5 MIN" : "15 MIN"),
    [mode],
  );

  async function interpret(uri?: string) {
    setBusy(true);
    setPhotoUri(uri);
    await new Promise((resolve) => setTimeout(resolve, 650));
    setIngredients(detectIngredientsFromPhoto(uri));
    setBusy(false);
    setStage("review");
  }

  async function openCamera() {
    try {
      if (Platform.OS !== "web") {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (!permission.granted) {
          await openLibrary();
          return;
        }
      }
      const result = await ImagePicker.launchCameraAsync({ allowsEditing: true, quality: 0.8 });
      if (!result.canceled) await interpret(result.assets[0]?.uri);
    } catch {
      await interpret();
    }
  }

  async function openLibrary() {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, quality: 0.8 });
      if (!result.canceled) await interpret(result.assets[0]?.uri);
    } catch {
      await interpret();
    }
  }

  function removeIngredient(item: string) {
    setIngredients((current) => current.filter((ingredient) => ingredient !== item));
  }

  function addIngredient() {
    const value = newIngredient.trim();
    if (!value) return;
    setIngredients((current) => [...current, value]);
    setNewIngredient("");
  }

  function makeRecipe() {
    setRecipe(generateRecipe(ingredients, mode));
    setStage("recipe");
  }

  function reset() {
    setStage("capture");
    setRecipe(undefined);
    setPhotoUri(undefined);
    setIngredients([]);
  }

  return (
    <ScreenContainer containerClassName="bg-[#FFF9F1]" safeAreaClassName="bg-[#FFF9F1]">
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.wordmark}>MATASERSH</Text>
            <Text style={styles.kicker}>ZERO-SEARCH COOKING</Text>
          </View>
          <View style={styles.statusDot} />
        </View>

        {stage === "capture" && (
          <View>
            <View style={styles.heroRow}>
              <View style={styles.heroCopy}>
                <Text style={styles.eyebrow}>WHAT&apos;S WITHIN REACH?</Text>
                <Text style={styles.heroTitle}>Make a meal from the chaos.</Text>
                <Text style={styles.heroBody}>
                  Show me your fridge or pantry. I’ll turn what’s there into a realistic next step.
                </Text>
              </View>
              <View style={styles.sparkBadge}>
                <Ionicons name="sparkles" size={18} color={ink} />
                <Text style={styles.badgeText}>NO SEARCH</Text>
              </View>
            </View>

            <View style={styles.captureCard}>
              {photoUri ? <Image source={{ uri: photoUri }} style={styles.previewImage} /> : <View style={styles.cameraGraphic}><Ionicons name="camera-outline" size={44} color={coral} /><Text style={styles.cameraHint}>FRIDGE / PANTRY</Text></View>}
              <TouchableOpacity style={styles.primaryButton} onPress={openCamera} activeOpacity={0.88}>
                <Ionicons name="camera" size={21} color="#FFFFFF" />
                <Text style={styles.primaryButtonText}>Scan what I have</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryButton} onPress={openLibrary} activeOpacity={0.75}>
                <Ionicons name="images-outline" size={17} color={ink} />
                <Text style={styles.secondaryButtonText}>Choose a pantry photo</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.sampleButton} onPress={() => interpret()} activeOpacity={0.75}>
                <Text style={styles.sampleText}>Use a sample fridge</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.timeStrip}>
              <Text style={styles.stripLabel}>COOKING SPEED</Text>
              <View style={styles.modeRow}>
                <ModeButton active={mode === "5-minute emergency"} label="5 MIN" caption="Emergency" onPress={() => setMode("5-minute emergency")} />
                <ModeButton active={mode === "15-minute sprint"} label="15 MIN" caption="Sprint" onPress={() => setMode("15-minute sprint")} />
              </View>
            </View>
          </View>
        )}

        {stage === "review" && (
          <View>
            <View style={styles.sectionIntro}>
              <Text style={styles.eyebrow}>STEP 02 / CONFIRM</Text>
              <Text style={styles.sectionTitle}>Here’s what I spotted.</Text>
              <Text style={styles.sectionBody}>Keep, remove, or add anything before I improvise.</Text>
            </View>
            <View style={styles.photoThumbRow}>
              {photoUri ? <Image source={{ uri: photoUri }} style={styles.photoThumb} /> : <View style={[styles.photoThumb, styles.sampleThumb]}><Ionicons name="sparkles" size={20} color={coral} /></View>}
              <View><Text style={styles.thumbTitle}>Vision pass complete</Text><Text style={styles.thumbMeta}>Editable ingredient list</Text></View>
              <View style={styles.donePill}><Ionicons name="checkmark" size={14} color="#3B6B47" /><Text style={styles.doneText}>READY</Text></View>
            </View>
            <View style={styles.ingredientCard}>
              <View style={styles.cardHeader}><Text style={styles.cardLabel}>DETECTED INGREDIENTS</Text><Text style={styles.cardCount}>{ingredients.length} items</Text></View>
              <View style={styles.chipWrap}>{ingredients.map((item) => <View key={item} style={styles.ingredientChip}><Text style={styles.chipText}>{item}</Text><Pressable onPress={() => removeIngredient(item)} hitSlop={8}><Ionicons name="close" size={15} color={ink} /></Pressable></View>)}</View>
              <View style={styles.addRow}><TextInput value={newIngredient} onChangeText={setNewIngredient} onSubmitEditing={addIngredient} placeholder="Add an ingredient" placeholderTextColor="#9C9A91" style={styles.addInput} /><TouchableOpacity onPress={addIngredient} style={styles.addButton}><Ionicons name="add" size={20} color={ink} /></TouchableOpacity></View>
            </View>
            <View style={styles.timeStrip}><Text style={styles.stripLabel}>YOUR TIME MODE</Text><View style={styles.modeRow}><ModeButton active={mode === "5-minute emergency"} label="5 MIN" caption="Emergency" onPress={() => setMode("5-minute emergency")} /><ModeButton active={mode === "15-minute sprint"} label="15 MIN" caption="Sprint" onPress={() => setMode("15-minute sprint")} /></View></View>
            <TouchableOpacity style={styles.primaryButton} onPress={makeRecipe} activeOpacity={0.88}><Ionicons name="restaurant-outline" size={21} color="#FFFFFF" /><Text style={styles.primaryButtonText}>Make me a recipe</Text></TouchableOpacity>
            <TouchableOpacity style={styles.textButton} onPress={reset}><Text style={styles.textButtonText}>Retake photo</Text></TouchableOpacity>
          </View>
        )}

        {stage === "recipe" && recipe && (
          <View>
            <View style={styles.recipeTop}><View><Text style={styles.eyebrow}>ZERO-SEARCH RESULT</Text><Text style={styles.recipeTitle}>{recipe.title}</Text><Text style={styles.recipeMeta}>{recipe.servings}  ·  made for your {modeLabel} window</Text></View><View style={styles.timeBadge}><Text style={styles.timeBadgeNumber}>{recipe.time.replace(" min", "")}</Text><Text style={styles.timeBadgeLabel}>MIN</Text></View></View>
            <View style={styles.recipeCard}><View style={styles.recipeCardHead}><Text style={styles.cardLabel}>YOU’LL NEED</Text><Text style={styles.cardCount}>{recipe.ingredients.length} ingredients</Text></View>{recipe.ingredients.map((item) => <View key={item} style={styles.ingredientLine}><View style={styles.bullet} /><Text style={styles.ingredientLineText}>{item}</Text></View>)}</View>
            <View style={styles.stepsCard}><Text style={styles.cardLabel}>MAKE IT HAPPEN</Text>{recipe.steps.map((step, index) => <View key={step} style={styles.stepRow}><View style={styles.stepNumber}><Text style={styles.stepNumberText}>{index + 1}</Text></View><Text style={styles.stepText}>{step}</Text></View>)}</View>
            {recipe.substitutions.map((swap) => <View key={swap.from} style={styles.swapCard}><View style={styles.swapIcon}><Ionicons name="swap-horizontal" size={21} color={ink} /></View><View style={{ flex: 1 }}><Text style={styles.swapTitle}>No {swap.from.toLowerCase()}? Keep moving.</Text><Text style={styles.swapBody}>Try {swap.to.toLowerCase()} instead.</Text></View><Ionicons name="arrow-forward" size={18} color={ink} /></View>)}
            <TouchableOpacity style={styles.primaryButton} onPress={reset} activeOpacity={0.88}><Ionicons name="refresh" size={20} color="#FFFFFF" /><Text style={styles.primaryButtonText}>Cook something else</Text></TouchableOpacity>
            <TouchableOpacity style={styles.textButton} onPress={() => setStage("review")}><Text style={styles.textButtonText}>Edit ingredients</Text></TouchableOpacity>
          </View>
        )}

        {busy && <View style={styles.loadingOverlay}><ActivityIndicator color={coral} size="large" /><Text style={styles.loadingTitle}>Reading the shelf…</Text><Text style={styles.loadingBody}>Looking for ingredients, not perfection.</Text></View>}
      </ScrollView>
    </ScreenContainer>
  );
}

function ModeButton({ active, label, caption, onPress }: { active: boolean; label: string; caption: string; onPress: () => void }) {
  return <TouchableOpacity onPress={onPress} activeOpacity={0.82} style={[styles.modeButton, active && styles.modeButtonActive]}><Text style={[styles.modeLabel, active && styles.modeLabelActive]}>{label}</Text><Text style={[styles.modeCaption, active && styles.modeCaptionActive]}>{caption}</Text></TouchableOpacity>;
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 22, paddingBottom: 42, maxWidth: 600, width: "100%", alignSelf: "center" },
  header: { paddingTop: 8, paddingBottom: 26, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  wordmark: { color: ink, fontSize: 16, fontWeight: "900", letterSpacing: 2.5 },
  kicker: { color: muted, fontSize: 9, fontWeight: "700", letterSpacing: 1.4, marginTop: 3 },
  statusDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: sage, borderWidth: 3, borderColor: "#E1EEDC" },
  heroRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 },
  heroCopy: { flex: 1, paddingRight: 12 },
  eyebrow: { color: coral, fontSize: 10, fontWeight: "800", letterSpacing: 1.5, marginBottom: 9 },
  heroTitle: { color: ink, fontSize: 38, lineHeight: 41, fontWeight: "900", letterSpacing: -1.3 },
  heroBody: { color: muted, fontSize: 15, lineHeight: 22, marginTop: 13, maxWidth: 355 },
  sparkBadge: { width: 74, height: 74, borderRadius: 37, backgroundColor: yellow, alignItems: "center", justifyContent: "center", transform: [{ rotate: "8deg" }], marginTop: 4 },
  badgeText: { color: ink, fontSize: 8, fontWeight: "900", letterSpacing: 0.7, marginTop: 4 },
  captureCard: { backgroundColor: "#F2E9DB", borderRadius: 26, padding: 14, alignItems: "center", borderWidth: 1, borderColor: line },
  cameraGraphic: { width: "100%", height: 182, borderRadius: 18, backgroundColor: "#F9F2E7", borderWidth: 1, borderColor: "#E6D9C7", borderStyle: "dashed", alignItems: "center", justifyContent: "center" },
  cameraHint: { color: muted, fontSize: 10, fontWeight: "800", letterSpacing: 1.6, marginTop: 10 },
  previewImage: { width: "100%", height: 182, borderRadius: 18, backgroundColor: "#E9E1D5" },
  primaryButton: { width: "100%", height: 54, borderRadius: 16, backgroundColor: coral, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, marginTop: 14, shadowColor: coral, shadowOpacity: 0.22, shadowRadius: 12, shadowOffset: { width: 0, height: 7 }, elevation: 4 },
  primaryButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "800" },
  secondaryButton: { height: 44, flexDirection: "row", alignItems: "center", gap: 8 },
  secondaryButtonText: { color: ink, fontSize: 14, fontWeight: "700" },
  sampleButton: { paddingVertical: 8 },
  sampleText: { color: muted, fontSize: 12, textDecorationLine: "underline" },
  timeStrip: { marginTop: 26, marginBottom: 18 },
  stripLabel: { color: muted, fontSize: 10, fontWeight: "800", letterSpacing: 1.5, marginBottom: 10 },
  modeRow: { flexDirection: "row", gap: 10 },
  modeButton: { flex: 1, borderRadius: 15, borderWidth: 1, borderColor: line, padding: 13, backgroundColor: "#FFFDF8" },
  modeButtonActive: { borderColor: ink, backgroundColor: ink },
  modeLabel: { color: ink, fontSize: 14, fontWeight: "900" },
  modeLabelActive: { color: yellow },
  modeCaption: { color: muted, fontSize: 12, marginTop: 3 },
  modeCaptionActive: { color: "#DDE6E4" },
  sectionIntro: { marginBottom: 21 },
  sectionTitle: { color: ink, fontSize: 32, lineHeight: 36, fontWeight: "900", letterSpacing: -0.7 },
  sectionBody: { color: muted, fontSize: 15, marginTop: 8 },
  photoThumbRow: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 18 },
  photoThumb: { width: 58, height: 58, borderRadius: 16, backgroundColor: "#EEE3D3" },
  sampleThumb: { alignItems: "center", justifyContent: "center" },
  thumbTitle: { color: ink, fontWeight: "800", fontSize: 14 },
  thumbMeta: { color: muted, fontSize: 12, marginTop: 4 },
  donePill: { marginLeft: "auto", backgroundColor: "#E2F0DF", borderRadius: 99, paddingHorizontal: 10, paddingVertical: 7, flexDirection: "row", gap: 4, alignItems: "center" },
  doneText: { color: "#3B6B47", fontSize: 9, fontWeight: "900", letterSpacing: 0.8 },
  ingredientCard: { backgroundColor: "#FFFFFF", borderRadius: 22, padding: 18, borderWidth: 1, borderColor: line },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  cardLabel: { color: muted, fontSize: 10, fontWeight: "900", letterSpacing: 1.5 },
  cardCount: { color: muted, fontSize: 11 },
  chipWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  ingredientChip: { backgroundColor: "#EAF2E8", borderRadius: 99, paddingVertical: 9, paddingLeft: 13, paddingRight: 9, flexDirection: "row", alignItems: "center", gap: 7 },
  chipText: { color: ink, fontSize: 13, fontWeight: "700" },
  addRow: { flexDirection: "row", alignItems: "center", borderTopWidth: 1, borderTopColor: line, marginTop: 18, paddingTop: 13 },
  addInput: { flex: 1, color: ink, fontSize: 14, paddingVertical: 8 },
  addButton: { width: 33, height: 33, borderRadius: 17, backgroundColor: yellow, alignItems: "center", justifyContent: "center" },
  textButton: { alignItems: "center", paddingVertical: 16 },
  textButtonText: { color: ink, fontSize: 14, fontWeight: "800", textDecorationLine: "underline" },
  recipeTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 },
  recipeTitle: { color: ink, fontSize: 34, lineHeight: 37, fontWeight: "900", letterSpacing: -1 },
  recipeMeta: { color: muted, fontSize: 13, marginTop: 9 },
  timeBadge: { width: 68, height: 68, borderRadius: 34, backgroundColor: yellow, alignItems: "center", justifyContent: "center", marginLeft: 10 },
  timeBadgeNumber: { color: ink, fontSize: 23, fontWeight: "900", lineHeight: 23 },
  timeBadgeLabel: { color: ink, fontSize: 9, fontWeight: "900", letterSpacing: 1 },
  recipeCard: { backgroundColor: "#FFFFFF", borderRadius: 22, padding: 19, borderWidth: 1, borderColor: line, marginBottom: 12 },
  recipeCardHead: { flexDirection: "row", justifyContent: "space-between", marginBottom: 14 },
  ingredientLine: { flexDirection: "row", alignItems: "center", paddingVertical: 7, gap: 10 },
  bullet: { width: 7, height: 7, borderRadius: 4, backgroundColor: coral },
  ingredientLineText: { color: ink, fontSize: 14, fontWeight: "600" },
  stepsCard: { backgroundColor: ink, borderRadius: 22, padding: 19, marginBottom: 12 },
  stepsCardLabel: { color: "#B6C5C4" },
  stepRow: { flexDirection: "row", gap: 12, marginTop: 16 },
  stepNumber: { width: 26, height: 26, borderRadius: 13, backgroundColor: yellow, alignItems: "center", justifyContent: "center" },
  stepNumberText: { color: ink, fontWeight: "900", fontSize: 12 },
  stepText: { flex: 1, color: "#F7F3EA", fontSize: 14, lineHeight: 20, paddingTop: 2 },
  swapCard: { flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: "#EAF2E8", borderRadius: 18, padding: 15, marginBottom: 14 },
  swapIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: sage, alignItems: "center", justifyContent: "center" },
  swapTitle: { color: ink, fontWeight: "900", fontSize: 13 },
  swapBody: { color: muted, fontSize: 12, marginTop: 3 },
  loadingOverlay: { position: "absolute", left: 22, right: 22, top: 230, backgroundColor: "#FFFDF8", borderRadius: 22, padding: 24, alignItems: "center", borderWidth: 1, borderColor: line, shadowColor: "#000", shadowOpacity: 0.12, shadowRadius: 20, shadowOffset: { width: 0, height: 9 }, elevation: 5 },
  loadingTitle: { color: ink, fontWeight: "900", fontSize: 17, marginTop: 12 },
  loadingBody: { color: muted, fontSize: 13, marginTop: 5 },
});
