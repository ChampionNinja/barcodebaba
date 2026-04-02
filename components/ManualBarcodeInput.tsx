'use client';

import { FormEvent, useState } from 'react';

interface ManualBarcodeInputProps {
  onSubmitBarcode: (barcode: string) => void;
}

export function ManualBarcodeInput({ onSubmitBarcode }: ManualBarcodeInputProps) {
  const [value, setValue] = useState('');

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const normalized = value.trim();
    if (!normalized) return;
    onSubmitBarcode(normalized);
  };

  return (
    <form onSubmit={submit} className="space-y-2">
      <label className="block text-sm font-semibold text-slate-700">Enter barcode manually</label>
      <div className="flex gap-2">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-health-500"
          placeholder="e.g. 3017620422003"
        />
        <button className="rounded-xl bg-health-500 px-4 py-2 text-sm font-semibold text-white hover:bg-health-700">
          Submit
        </button>
      </div>
    </form>
  );
}
