import { OFFProduct } from '@/types/profile';

interface OFFResponse {
  status: number;
  product?: {
    code?: string;
    product_name?: string;
    ingredients_text?: string;
    allergens?: string;
    nutrition_grades?: string;
    additives_tags?: string[];
    nutriments?: {
      sugars_100g?: number;
      'saturated-fat_100g'?: number;
      sodium_100g?: number;
      fiber_100g?: number;
      proteins_100g?: number;
    };
  };
}

export async function fetchProductByBarcode(barcode: string): Promise<OFFProduct | null> {
  const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);

  if (!response.ok) {
    throw new Error('Failed to fetch Open Food Facts data');
  }

  const data = (await response.json()) as OFFResponse;

  if (data.status !== 1 || !data.product) {
    return null;
  }

  const product = data.product;

  return {
    code: product.code ?? barcode,
    productName: product.product_name?.trim() || 'Unknown Product',
    ingredientsText: product.ingredients_text?.trim() || 'Ingredients not available',
    allergensText: product.allergens?.trim() || 'Allergen info not available',
    nutritionGrade: (product.nutrition_grades ?? 'unknown').toUpperCase(),
    nutriments: {
      sugars: product.nutriments?.sugars_100g ?? 0,
      saturatedFat: product.nutriments?.['saturated-fat_100g'] ?? 0,
      sodium: product.nutriments?.sodium_100g ?? 0,
      fiber: product.nutriments?.fiber_100g ?? 0,
      proteins: product.nutriments?.proteins_100g ?? 0,
    },
    additives: product.additives_tags ?? [],
  };
}
