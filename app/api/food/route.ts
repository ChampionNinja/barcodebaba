import { NextRequest, NextResponse } from 'next/server';
import { fetchProductByBarcode } from '@/lib/openFoodFacts';

interface FoodPayload {
  barcode?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as FoodPayload;
    const barcode = body.barcode?.trim();

    if (!barcode) {
      return NextResponse.json({ error: 'Barcode is required.' }, { status: 400 });
    }

    const product = await fetchProductByBarcode(barcode);

    if (!product) {
      return NextResponse.json({ error: 'Product not found for this barcode.' }, { status: 404 });
    }

    return NextResponse.json({ product }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: 'Unable to process barcode. Please try again shortly.' },
      { status: 500 },
    );
  }
}
