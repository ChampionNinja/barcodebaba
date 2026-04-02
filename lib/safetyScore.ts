import { OFFProduct, SafetyResult, UserMode, UserProfile } from '@/types/profile';

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export function calculateSafetyScore(
  product: OFFProduct,
  userProfile: UserProfile,
  mode: UserMode,
): SafetyResult {
  const warnings: string[] = [];
  const positives: string[] = [];

  let generalHealth = 60;

  const { sugars, saturatedFat, sodium, fiber, proteins } = product.nutriments;

  generalHealth -= clamp(sugars * 1.4, 0, 20);
  generalHealth -= clamp(saturatedFat * 2.2, 0, 20);
  generalHealth -= clamp(sodium * 35, 0, 20);
  generalHealth += clamp(fiber * 1.8, 0, 10);
  generalHealth += clamp(proteins * 1.2, 0, 10);

  if (sugars <= 5) positives.push('Low sugar level per 100g.');
  else warnings.push('Sugar content is on the higher side.');

  if (saturatedFat <= 2) positives.push('Low saturated fat profile.');
  else warnings.push('Saturated fat may not be ideal for frequent intake.');

  if (sodium <= 0.2) positives.push('Low sodium level supports better heart health.');
  else warnings.push('Sodium is high and should be monitored.');

  if (fiber >= 3) positives.push('Contains useful dietary fiber.');

  let profileScore = 40;

  const allergies = userProfile.allergies.map((a) => a.toLowerCase());
  const allergenText = `${product.allergensText} ${product.ingredientsText}`.toLowerCase();

  const allergenRules: Record<string, string[]> = {
    'lactose intolerance': ['milk', 'lactose', 'whey'],
    'peanut allergy': ['peanut'],
    'gluten allergy': ['wheat', 'gluten', 'barley', 'rye'],
    'soy allergy': ['soy', 'soya'],
    'tree nut allergy': ['almond', 'cashew', 'walnut', 'hazelnut', 'pecan', 'nut'],
  };

  for (const allergy of allergies) {
    const keywords = allergenRules[allergy];
    if (!keywords) continue;

    if (keywords.some((keyword) => allergenText.includes(keyword))) {
      profileScore -= 25;
      warnings.push(`Potential allergen risk detected for ${allergy}.`);
    }
  }

  const conditions = userProfile.healthConditions;

  if (conditions.includes('Diabetes') && sugars > 5) {
    profileScore -= 10;
    warnings.push('Not ideal for diabetes due to higher sugar.');
  }

  if ((conditions.includes('Heart Disease') || conditions.includes('High Cholesterol')) && saturatedFat > 3) {
    profileScore -= 10;
    warnings.push('Saturated fat can be concerning for heart/cholesterol conditions.');
  }

  if (conditions.includes('Hypertension') && sodium > 0.2) {
    profileScore -= 10;
    warnings.push('Sodium level may not suit hypertension management.');
  }

  if (mode === 'baby') {
    if (sugars > 4) {
      profileScore -= 10;
      warnings.push('Baby Mode: sugar threshold exceeded.');
    }
    if (product.additives.length > 0) {
      profileScore -= 8;
      warnings.push('Baby Mode: additives detected, choose minimal-processed alternatives.');
    }
  }

  if (mode === 'elderly') {
    if (sodium > 0.15) {
      profileScore -= 8;
      warnings.push('Elderly Mode: sodium is higher than preferred.');
    }
    if (saturatedFat > 2.5) {
      profileScore -= 8;
      warnings.push('Elderly Mode: saturated fat is above stricter recommendation.');
    }
  }

  if (mode === 'general') {
    positives.push('General Mode applies a balanced nutrition lens.');
  }

  const score = clamp(Math.round(generalHealth + profileScore), 0, 100);

  if (score >= 75) positives.push('Overall, this product appears relatively safe for your profile.');
  else if (score < 50) warnings.push('Consider safer alternatives for routine consumption.');

  return {
    score,
    warnings: Array.from(new Set(warnings)),
    positives: Array.from(new Set(positives)),
  };
}
