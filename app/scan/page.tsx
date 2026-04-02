'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BarcodeScanner } from '@/components/BarcodeScanner';
import { ManualBarcodeInput } from '@/components/ManualBarcodeInput';
import { SafetyScoreCard } from '@/components/SafetyScoreCard';
import { calculateSafetyScore } from '@/lib/safetyScore';
import { loadMode, loadProfile } from '@/lib/storage';
import { OFFProduct, SafetyResult, UserMode, UserProfile } from '@/types/profile';

interface FoodApiResponse {
  product: OFFProduct;
}

export default function ScanPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [mode, setMode] = useState<UserMode | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [product, setProduct] = useState<OFFProduct | null>(null);
  const [result, setResult] = useState<SafetyResult | null>(null);

  useEffect(() => {
    const userProfile = loadProfile();
    const userMode = loadMode();

    if (!userProfile || !userMode) {
      router.replace('/');
      return;
    }

    setProfile(userProfile);
    setMode(userMode);
  }, [router]);

  const processBarcode = useCallback(
    async (barcode: string) => {
      if (!profile || !mode) return;

      setLoading(true);
      setError('');

      try {
        const response = await fetch('/api/food', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ barcode }),
        });

        if (!response.ok) {
          throw new Error('Unable to fetch product details for this barcode.');
        }

        const data = (await response.json()) as FoodApiResponse;
        const nextResult = calculateSafetyScore(data.product, profile, mode);

        setProduct(data.product);
        setResult(nextResult);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong while scanning.');
      } finally {
        setLoading(false);
      }
    },
    [profile, mode],
  );

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-4 py-12">
      <h1 className="text-4xl font-extrabold text-slate-900">Scan Barcode</h1>
      <p className="mt-2 text-sm text-slate-600">Allow camera access or enter barcode manually.</p>

      <section className="mt-6 space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
        <BarcodeScanner onDetected={processBarcode} />
        <ManualBarcodeInput onSubmitBarcode={processBarcode} />
      </section>

      {loading ? <p className="mt-4 text-sm font-medium text-health-700">Analyzing product safety...</p> : null}
      {error ? <p className="mt-4 text-sm font-semibold text-red-600">{error}</p> : null}

      {product && result ? (
        <div className="mt-8">
          <SafetyScoreCard product={product} result={result} />
        </div>
      ) : null}
    </main>
  );
}
