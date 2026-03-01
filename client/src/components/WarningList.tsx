import { type AppMode } from "@/hooks/use-mode";
import { AlertOctagon, Baby, CheckCircle, Info } from "lucide-react";

interface WarningListProps {
  mode: AppMode;
  warnings: string[];
}

export function WarningList({ mode, warnings }: WarningListProps) {
  if (!warnings || warnings.length === 0) {
    return (
      <div
        className={`mt-6 p-6 rounded-2xl border flex flex-col items-center justify-center text-center ${
          mode === "elderly"
            ? "bg-white border-4 border-black text-black"
            : mode === "baby"
              ? "bg-emerald-100 border-emerald-200 text-emerald-900"
            : "bg-green-50/50 border-green-100 text-green-700"
        }`}
      >
        <CheckCircle className="w-12 h-12 mb-3 opacity-50" />
        <p className={`font-bold ${mode === "elderly" ? "text-xl" : "text-lg"}`}>
          No high-risk ingredients detected for this mode.
        </p>
      </div>
    );
  }

  const isElderly = mode === "elderly";
  const isBaby = mode === "baby";

  return (
    <div className="mt-6 space-y-4">
      <h3
        className={`flex items-center gap-2 font-display ${
          isElderly ? "text-2xl font-black" : "text-xl font-bold text-foreground"
        }`}
      >
        {isBaby ? <Baby className="w-6 h-6 text-pink-500" /> : <AlertOctagon className="w-6 h-6 text-red-500" />}
        {mode === "baby" ? "Baby Warnings" : "Warnings Detected"}
      </h3>

      <ul className="space-y-3">
        {warnings.map((warning, idx) => (
          <li
            key={idx}
            className={`flex items-start gap-3 p-4 rounded-xl ${
              isElderly
                ? "bg-yellow-100 border-4 border-black text-black text-lg font-bold"
                : isBaby
                  ? "bg-pink-100 border border-pink-200 text-violet-900 shadow-sm"
                  : "bg-red-50 border border-red-100 text-red-900 shadow-sm"
            }`}
          >
            <Info
              className={`w-6 h-6 shrink-0 mt-0.5 ${
                isElderly ? "text-black" : isBaby ? "text-pink-500" : "text-red-500"
              }`}
            />
            <span>{warning}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
