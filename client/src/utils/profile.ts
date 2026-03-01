export type ProfileDiet = "none" | "vegetarian" | "vegan";

export interface BarcodeBabaProfile {
  name: string;
  allergies: string[];
  diet: ProfileDiet;
  healthConditions: string[];
}

const PROFILE_KEY = "barcodeBabaProfile";

const DEFAULT_PROFILE: BarcodeBabaProfile = {
  name: "",
  allergies: [],
  diet: "none",
  healthConditions: [],
};

export function getProfile(): BarcodeBabaProfile | null {
  if (typeof window === "undefined") return null;

  const raw = localStorage.getItem(PROFILE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as Partial<BarcodeBabaProfile>;

    return {
      name: typeof parsed?.name === "string" ? parsed.name : DEFAULT_PROFILE.name,
      allergies: Array.isArray(parsed?.allergies) ? parsed.allergies : DEFAULT_PROFILE.allergies,
      diet: parsed?.diet === "vegetarian" || parsed?.diet === "vegan" ? parsed.diet : "none",
      healthConditions: Array.isArray(parsed?.healthConditions)
        ? parsed.healthConditions
        : DEFAULT_PROFILE.healthConditions,
    };
  } catch {
    return null;
  }
}

export function saveProfile(profile: BarcodeBabaProfile): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export function profileExists(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(PROFILE_KEY) !== null;
}
