import { type AppMode } from "@/hooks/use-mode";
import { AlertTriangle, CheckCircle, ShieldAlert, ShieldX } from "lucide-react";

interface ScoreCardProps {
  mode: AppMode;
  score: number;
  rating: "SAFE" | "MODERATE" | "RISKY" | "AVOID";
}

export function ScoreCard({ mode, score, rating }: ScoreCardProps) {
  const isElderly = mode === 'elderly';
  const isBaby = mode === 'baby';

  // Determine colors based on rating and mode
  let containerClass = "";
  let badgeClass = "";
  let Icon = CheckCircle;

  switch (rating) {
    case "SAFE":
      containerClass = isElderly 
        ? "bg-white border-4 border-green-800 text-black" 
        : isBaby
          ? "bg-emerald-100 border-emerald-200 shadow-emerald-300/20"
        : "bg-gradient-to-br from-emerald-50 to-emerald-100/50 border-emerald-200 shadow-emerald-500/10";
      badgeClass = isElderly ? "bg-green-800 text-white" : isBaby ? "bg-emerald-300 text-emerald-950" : "bg-emerald-500 text-white";
      Icon = CheckCircle;
      break;
    case "MODERATE":
      containerClass = isElderly 
        ? "bg-white border-4 border-yellow-600 text-black" 
        : isBaby
          ? "bg-yellow-100 border-yellow-200 shadow-yellow-300/20"
        : "bg-gradient-to-br from-amber-50 to-amber-100/50 border-amber-200 shadow-amber-500/10";
      badgeClass = isElderly ? "bg-yellow-600 text-white" : isBaby ? "bg-amber-300 text-amber-950" : "bg-amber-500 text-white";
      Icon = AlertTriangle;
      break;
    case "RISKY":
      containerClass = isElderly 
        ? "bg-white border-4 border-orange-700 text-black" 
        : isBaby
          ? "bg-orange-100 border-orange-200 shadow-orange-300/20"
        : "bg-gradient-to-br from-orange-50 to-orange-100/50 border-orange-200 shadow-orange-500/10";
      badgeClass = isElderly ? "bg-orange-700 text-white" : isBaby ? "bg-orange-300 text-orange-950" : "bg-orange-500 text-white";
      Icon = ShieldAlert;
      break;
    case "AVOID":
      containerClass = isElderly 
        ? "bg-amber-50 border-4 border-amber-400 text-amber-900" 
        : isBaby
          ? "bg-rose-100 border-rose-200 shadow-rose-300/20"
        : "bg-gradient-to-br from-red-50 to-red-100/50 border-red-200 shadow-red-500/10";
      badgeClass = isElderly ? "bg-red-600 text-white" : isBaby ? "bg-rose-300 text-rose-950" : "bg-red-500 text-white";
      Icon = ShieldX;
      break;
  }

  return (
    <div className={`relative overflow-hidden rounded-3xl border p-6 md:p-8 shadow-xl transition-all duration-300 ${containerClass}`}>
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className={`text-sm md:text-base font-bold uppercase tracking-wider ${isElderly ? '' : 'opacity-75'}`}>
            {mode} Safety Score
          </p>
          <div className="flex items-end gap-2">
            <span className={`text-6xl md:text-7xl font-display font-black leading-none ${isElderly && rating === 'AVOID' ? 'text-red-700' : ''}`}>
              {score}
            </span>
            <span className={`text-xl md:text-2xl font-bold mb-1 ${isElderly ? '' : 'opacity-50'}`}>
              /100
            </span>
          </div>
        </div>

        <div className={`flex flex-col items-center justify-center rounded-2xl p-4 md:p-5 ${badgeClass} shadow-lg`}>
          <Icon className="w-10 h-10 md:w-12 md:h-12 mb-2" strokeWidth={isElderly ? 3 : 2} />
          <span className="font-display font-bold tracking-widest text-sm md:text-base">
            {rating}
          </span>
        </div>
      </div>

      {mode === 'baby' && (
        <div className="absolute -bottom-6 -right-6 opacity-20 pointer-events-none text-violet-400">
          <Icon className="w-48 h-48" />
        </div>
      )}
    </div>
  );
}
