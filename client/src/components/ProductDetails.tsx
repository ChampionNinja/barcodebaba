import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { useMode } from "@/hooks/use-mode";

type ProductInfo = {
  ingredients_text?: string;
  allergens?: string;
  labels_tags?: string[];
  nutriments?: Record<string, string | number | undefined>;
};

interface ProductDetailsProps {
  product?: ProductInfo | null;
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const [expanded, setExpanded] = useState(false);
  const { mode } = useMode();
  const isBaby = mode === "baby";
  const isElderly = mode === "elderly";

  const vegetarianStatus = useMemo(() => {
    const tags = product?.labels_tags ?? [];
    if (tags.includes("en:vegan")) return "Vegan";
    if (tags.includes("en:vegetarian")) return "Vegetarian";
    return "Not vegetarian";
  }, [product?.labels_tags]);

  const nutriments = product?.nutriments ?? {};

  const nutritionBasis =
    nutriments.energy_kcal_100ml !== undefined ||
    nutriments["energy-kcal_100ml"] !== undefined ||
    nutriments.sugars_100ml !== undefined ||
    nutriments.sodium_100ml !== undefined ||
    nutriments.fat_100ml !== undefined ||
    nutriments.proteins_100ml !== undefined
      ? "100ml"
      : "100g";

  const formatNumber = (value: string | number) => {
    const numericValue = typeof value === "number" ? value : Number(value);
    if (Number.isNaN(numericValue)) {
      return String(value);
    }

    return numericValue.toFixed(2);
  };

  const getNutrimentDisplay = (primaryKey: string, fallbackKey: string, defaultUnit: string) => {
    const value = nutriments[primaryKey] ?? nutriments[fallbackKey];

    if (value === undefined || value === null || value === "") {
      return "Not available";
    }

    const unit = (nutriments[`${fallbackKey}_unit`] ?? nutriments[`${primaryKey}_unit`] ?? defaultUnit) as
      | string
      | undefined;

    const formattedValue = formatNumber(value);
    return unit ? `${formattedValue} ${unit}` : formattedValue;
  };

  const energyDisplay =
    nutritionBasis === "100ml"
      ? getNutrimentDisplay("energy-kcal_100ml", "energy-kcal_100ml", "kcal")
      : getNutrimentDisplay("energy-kcal_100g", "energy-kcal", "kcal") !== "Not available"
        ? getNutrimentDisplay("energy-kcal_100g", "energy-kcal", "kcal")
        : getNutrimentDisplay("energy-kcal_value_100g", "energy-kcal_value", "kcal");

  const cardClasses = isBaby
    ? "bg-pink-50 border-pink-200 text-pink-900"
    : isElderly
      ? "bg-amber-50 border-amber-200 text-amber-900"
      : "bg-card border-[#FFC107]/40 text-foreground";

  const toggleButtonClasses = isBaby
    ? "bg-pink-100 text-pink-800 border border-pink-300 hover:bg-pink-200"
    : isElderly
      ? "bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200"
      : "bg-background text-foreground border border-border hover:bg-muted";

  return (
    <div className={`rounded-2xl border p-6 space-y-4 shadow-sm ${cardClasses}`}>
      {!expanded ? (
        <div className="flex justify-center mt-3">
          <Button
            type="button"
            onClick={() => setExpanded(true)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors duration-200 shadow-none ${toggleButtonClasses}`}
          >
            Show more ▼
          </Button>
        </div>
      ) : (
        <>
          <h3 className={`text-2xl font-display font-bold ${isBaby ? "text-pink-900" : isElderly ? "text-amber-900" : "text-foreground"}`}>
            Detailed Product Information
          </h3>

          <div className={`space-y-4 text-lg ${isBaby ? "text-pink-900" : isElderly ? "text-amber-900" : "text-foreground"}`}>
            <div>
              <p className="font-semibold">Ingredients</p>
              <p>{product?.ingredients_text || "Not available"}</p>
            </div>

            <div>
              <p className="font-semibold">Allergens</p>
              <p>{product?.allergens || "Not available"}</p>
            </div>

            <div>
              <p className="font-semibold">Vegetarian Status</p>
              <p>{vegetarianStatus}</p>
            </div>

            <div>
              <p className="font-semibold">Nutrition Facts (per {nutritionBasis})</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Energy: {energyDisplay}</li>
                <li>
                  Sugar: {getNutrimentDisplay(`sugars_${nutritionBasis}`, "sugars", "g")}
                </li>
                <li>
                  Sodium: {getNutrimentDisplay(`sodium_${nutritionBasis}`, "sodium", "g")}
                </li>
                <li>Fat: {getNutrimentDisplay(`fat_${nutritionBasis}`, "fat", "g")}</li>
                <li>
                  Protein: {getNutrimentDisplay(`proteins_${nutritionBasis}`, "proteins", "g")}
                </li>
              </ul>
            </div>
          </div>

          <div className="flex justify-center mt-3">
            <Button
              type="button"
              onClick={() => setExpanded(false)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors duration-200 shadow-none ${toggleButtonClasses}`}
            >
              Show less ▲
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
