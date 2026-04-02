'use client';

import { UserMode } from '@/types/profile';

const modes: { key: UserMode; title: string; icon: string; description: string }[] = [
  { key: 'baby', title: 'Baby Mode', icon: '👶', description: 'Strict sugar and additive checks.' },
  { key: 'general', title: 'General Mode', icon: '🧑', description: 'Balanced daily-use analysis.' },
  { key: 'elderly', title: 'Elderly Mode', icon: '👴', description: 'Stronger sodium and fat filters.' },
];

interface ModeSelectorProps {
  selected: UserMode | null;
  onSelect: (mode: UserMode) => void;
}

export function ModeSelector({ selected, onSelect }: ModeSelectorProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {modes.map((mode) => (
        <button
          key={mode.key}
          type="button"
          onClick={() => onSelect(mode.key)}
          className={`rounded-2xl border p-5 text-left shadow-sm transition ${
            selected === mode.key
              ? 'border-health-500 bg-health-50 shadow-soft'
              : 'border-slate-200 bg-white hover:border-health-100'
          }`}
          aria-pressed={selected === mode.key}
        >
          <p className="text-3xl">{mode.icon}</p>
          <h3 className="mt-2 text-lg font-bold text-slate-800">{mode.title}</h3>
          <p className="mt-1 text-sm text-slate-600">{mode.description}</p>
        </button>
      ))}
    </div>
  );
}
