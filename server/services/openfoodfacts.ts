export interface OffProduct {
  product_name?: string;
  brands?: string;
  ingredients_text?: string;
  ingredients?: any[];
  allergens?: string;
  nutriments?: {
    sugars_100g?: number;
    sodium_100g?: number;
    [key: string]: any;
  };
  labels_tags?: string[];
  categories_tags?: string[];
}

export async function fetchProduct(barcode: string): Promise<OffProduct | null> {
  const url = `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      return null;
    }
    const data = await response.json();
    if (data.status !== 1 || !data.product) {
      return null;
    }
    return data.product;
  } catch (error) {
    console.error("Error fetching product from Open Food Facts:", error);
    return null;
  }
}
