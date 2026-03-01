import { z } from "zod";

export const ratingEnum = z.enum(["SAFE", "MODERATE", "RISKY", "AVOID"]);

export const userProfileSchema = z.object({
  name: z.string().default(""),
  allergies: z.array(z.string()).default([]),
  diet: z.enum(["none", "vegetarian", "vegan"]).default("none"),
  healthConditions: z.array(z.string()).default([]),
});

export const scanResponseSchema = z.object({
  product_name: z.string(),
  brand: z.string(),
  scores: z.object({
    general: z.number(),
    baby: z.number(),
    elderly: z.number(),
  }),
  rating: z.object({
    general: ratingEnum,
    baby: ratingEnum,
    elderly: ratingEnum,
  }),
  warnings: z.object({
    general: z.array(z.string()),
    baby: z.array(z.string()),
    elderly: z.array(z.string()),
  }),
  personalizedWarnings: z
    .object({
      general: z.array(z.string()),
      baby: z.array(z.string()),
      elderly: z.array(z.string()),
    })
    .default({ general: [], baby: [], elderly: [] }),
  ingredients_text: z.string().optional(),
  allergens: z.string().optional(),
  labels_tags: z.array(z.string()).optional(),
  nutriments: z.record(z.union([z.number(), z.string()])).optional(),
});

export const scanRequestSchema = z.object({
  barcode: z.string().min(1, "Barcode is required"),
  profile: userProfileSchema.optional(),
});

export type ScanRequest = z.infer<typeof scanRequestSchema>;
export type ScanResponse = z.infer<typeof scanResponseSchema>;
export type UserProfile = z.infer<typeof userProfileSchema>;
