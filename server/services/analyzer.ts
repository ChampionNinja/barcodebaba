import { type OffProduct } from "./openfoodfacts";
import type { ScanResponse, UserProfile } from "@shared/schema";
import { ratingEnum } from "@shared/schema";
import { z } from "zod";

const ALLERGY_KEYWORDS: Record<string, string[]> = {
  "Lactose intolerance": ["milk", "lactose", "whey"],
  "Peanut allergy": ["peanut", "groundnut"],
  "Gluten allergy": ["wheat", "gluten", "barley"],
  "Soy allergy": ["soy"],
  "Tree nut allergy": ["almond", "cashew", "walnut"],
};

export function analyzeProduct(product: OffProduct, profile?: UserProfile): ScanResponse {
  const name = product.product_name || "Unknown Product";
  const brand = product.brands || "Unknown Brand";

  const sugars = product.nutriments?.sugars_100g || 0;
  const sodium_g = product.nutriments?.sodium_100g || 0;
  const sodium_mg = sodium_g * 1000;
  const fat = product.nutriments?.fat_100g || 0;

  const ingredientsText = (product.ingredients_text || "").toLowerCase();
  let ingredientCount = 0;
  if (product.ingredients && product.ingredients.length > 0) {
    ingredientCount = product.ingredients.length;
  } else if (ingredientsText) {
    ingredientCount = ingredientsText.split(",").length;
  }

  const categories = (product.categories_tags || []).map((c) => c.toLowerCase());
  const allergens = (product.allergens || "").toLowerCase();
  const searchableProductText = `${ingredientsText} ${allergens}`;

  let generalScore = 100;
  let babyScore = 100;
  let elderlyScore = 100;

  const generalWarnings: string[] = [];
  const babyWarnings: string[] = [];
  const elderlyWarnings: string[] = [];

  const personalizedWarnings = {
    general: [] as string[],
    baby: [] as string[],
    elderly: [] as string[],
  };

  if (sugars > 15) {
    generalScore -= 20;
    generalWarnings.push("High sugar content");
  }
  if (sodium_mg > 400) {
    generalScore -= 20;
    generalWarnings.push("High sodium content");
  }
  const hasUPF = /(emulsifier|preservative|artificial flavor|artificial color)/i.test(ingredientsText);
  if (hasUPF) {
    generalScore -= 15;
    generalWarnings.push("Contains ultra-processed ingredients");
  }
  if (ingredientCount > 10) {
    generalScore -= 10;
    generalWarnings.push("High number of ingredients");
  }

  const hasAddedSugar = /(sugar|sucrose|glucose|corn syrup|fructose)/i.test(ingredientsText);
  if (hasAddedSugar) {
    babyScore -= 30;
    babyWarnings.push("Contains added sugar");
  }
  if (sodium_mg > 120) {
    babyScore -= 25;
    babyWarnings.push("High sodium for baby");
  }
  if (hasUPF) {
    babyScore -= 20;
    babyWarnings.push("Ultra processed food");
  }
  if (ingredientCount > 5) {
    const extra = ingredientCount - 5;
    babyScore -= extra * 2;
    babyWarnings.push("Too many ingredients");
  }
  const hasChokingHazard = categories.some((c) => c.includes("nuts") || c.includes("popcorn") || c.includes("candy"));
  if (hasChokingHazard) {
    babyScore -= 40;
    babyWarnings.push("Choking hazard");
  }
  const hasAllergens = /(milk|soy|peanuts|tree nuts)/i.test(allergens);
  if (hasAllergens) {
    babyScore -= 30;
    babyWarnings.push("Allergens present");
  }

  if (sodium_mg > 400) {
    elderlyScore -= 30;
    elderlyWarnings.push("High sodium (heart risk)");
  }
  if (sugars > 10) {
    elderlyScore -= 25;
    elderlyWarnings.push("High sugar (diabetes risk)");
  }
  if (hasUPF) {
    elderlyScore -= 15;
    elderlyWarnings.push("Ultra processed food");
  }
  if (ingredientCount > 8) {
    elderlyScore -= 10;
    elderlyWarnings.push("Too many ingredients");
  }

  const selectedAllergies = (profile?.allergies || []).filter((a) => a !== "None");
  for (const allergy of selectedAllergies) {
    const keywords = ALLERGY_KEYWORDS[allergy] || [];
    const matchedKeyword = keywords.find((keyword) => searchableProductText.includes(keyword));
    if (matchedKeyword) {
      const warning = `This product contains ${matchedKeyword} which may trigger your ${allergy.toLowerCase()}.`;
      personalizedWarnings.general.push(warning);
      personalizedWarnings.baby.push(warning);
      personalizedWarnings.elderly.push(warning);
      generalScore -= 30;
      babyScore -= 40;
      elderlyScore -= 30;
    }
  }

  const selectedHealthConditions = (profile?.healthConditions || []).filter((condition) => condition !== "None");

  if (selectedHealthConditions.includes("Diabetes") && sugars > 10) {
    const warning = "This product has high sugar. Not recommended for diabetes.";
    personalizedWarnings.general.push(warning);
    personalizedWarnings.elderly.push(warning);
    generalScore -= 20;
    elderlyScore -= 25;
  }

  const hasCardioCondition =
    selectedHealthConditions.includes("Hypertension") || selectedHealthConditions.includes("Heart disease");
  if (hasCardioCondition && sodium_mg > 400) {
    const warning = "This product is high in sodium. Risky for blood pressure and heart.";
    personalizedWarnings.general.push(warning);
    personalizedWarnings.elderly.push(warning);
    generalScore -= 20;
    elderlyScore -= 30;
  }

  if (selectedHealthConditions.includes("High cholesterol") && fat > 17) {
    const warning = "This product is high in fat. Risky for cholesterol.";
    personalizedWarnings.general.push(warning);
    personalizedWarnings.elderly.push(warning);
    generalScore -= 15;
    elderlyScore -= 25;
  }

  generalScore = Math.max(0, Math.min(100, generalScore));
  babyScore = Math.max(0, Math.min(100, babyScore));
  elderlyScore = Math.max(0, Math.min(100, elderlyScore));

  const getRating = (score: number) => {
    if (score >= 80) return "SAFE";
    if (score >= 60) return "MODERATE";
    if (score >= 40) return "RISKY";
    return "AVOID";
  };

  return {
    product_name: name,
    brand,
    scores: {
      general: generalScore,
      baby: babyScore,
      elderly: elderlyScore,
    },
    rating: {
      general: getRating(generalScore) as z.infer<typeof ratingEnum>,
      baby: getRating(babyScore) as z.infer<typeof ratingEnum>,
      elderly: getRating(elderlyScore) as z.infer<typeof ratingEnum>,
    },
    warnings: {
      general: generalWarnings,
      baby: babyWarnings,
      elderly: elderlyWarnings,
    },
    personalizedWarnings,
    ingredients_text: product.ingredients_text,
    allergens: product.allergens,
    labels_tags: product.labels_tags,
    nutriments: product.nutriments,
  };
}
