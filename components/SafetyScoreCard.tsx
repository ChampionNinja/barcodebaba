import { OFFProduct, SafetyResult } from '@/types/profile';

interface SafetyScoreCardProps {
  result: SafetyResult;
  product: OFFProduct;
}

export function SafetyScoreCard({ result, product }: SafetyScoreCardProps) {
  const color = result.score >= 75 ? 'text-green-600' : result.score >= 50 ? 'text-amber-600' : 'text-red-600';

  return (
    <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">{product.productName}</h2>
          <p className="text-sm text-slate-500">Nutrition Grade: {product.nutritionGrade}</p>
        </div>
        <div className={`text-4xl font-extrabold ${color}`}>{result.score}</div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-slate-800">Ingredients</h3>
        <p className="mt-1 text-sm text-slate-600">{product.ingredientsText}</p>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-slate-800">Nutrition Summary (per 100g)</h3>
        <ul className="mt-1 grid grid-cols-2 gap-2 text-sm text-slate-600 sm:grid-cols-3">
          <li>Sugar: {product.nutriments.sugars}g</li>
          <li>Saturated Fat: {product.nutriments.saturatedFat}g</li>
          <li>Sodium: {product.nutriments.sodium}g</li>
          <li>Fiber: {product.nutriments.fiber}g</li>
          <li>Protein: {product.nutriments.proteins}g</li>
        </ul>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <h3 className="text-sm font-semibold text-red-700">Warnings</h3>
          <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-slate-700">
            {result.warnings.length ? result.warnings.map((item) => <li key={item}>{item}</li>) : <li>No major warnings.</li>}
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-green-700">Health Insights</h3>
          <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-slate-700">
            {result.positives.length ? result.positives.map((item) => <li key={item}>{item}</li>) : <li>No positives found.</li>}
          </ul>
        </div>
      </div>
    </section>
  );
}
