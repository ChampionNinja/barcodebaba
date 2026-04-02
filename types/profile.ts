export const ALLERGY_OPTIONS = [
  'Lactose Intolerance',
  'Peanut Allergy',
  'Gluten Allergy',
  'Soy Allergy',
  'Tree Nut Allergy',
  'None',
] as const;

export const HEALTH_CONDITION_OPTIONS = [
  'Diabetes',
  'Heart Disease',
  'Hypertension',
  'High Cholesterol',
  'None',
] as const;

export const MODE_OPTIONS = ['baby', 'general', 'elderly'] as const;

export type UserMode = (typeof MODE_OPTIONS)[number];
export type Allergy = (typeof ALLERGY_OPTIONS)[number];
export type HealthCondition = (typeof HEALTH_CONDITION_OPTIONS)[number];

export interface UserProfile {
  name: string;
  allergies: Allergy[];
  dietaryPreference: 'None' | 'Vegetarian';
  healthConditions: HealthCondition[];
}

export interface OFFProduct {
  code: string;
  productName: string;
  ingredientsText: string;
  allergensText: string;
  nutritionGrade: string;
  nutriments: {
    sugars: number;
    saturatedFat: number;
    sodium: number;
    fiber: number;
    proteins: number;
  };
  additives: string[];
}

export interface SafetyResult {
  score: number;
  warnings: string[];
  positives: string[];
}
