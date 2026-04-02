'use client';

import { FormEvent, useEffect, useState } from 'react';
import {
  ALLERGY_OPTIONS,
  HEALTH_CONDITION_OPTIONS,
  HealthCondition,
  UserProfile,
} from '@/types/profile';

interface ProfileModalProps {
  isOpen: boolean;
  initialProfile: UserProfile | null;
  onClose: () => void;
  onSave: (profile: UserProfile) => void;
}

export function ProfileModal({ isOpen, initialProfile, onClose, onSave }: ProfileModalProps) {
  const [form, setForm] = useState<UserProfile>({
    name: '',
    allergies: [],
    dietaryPreference: 'None',
    healthConditions: [],
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialProfile) setForm(initialProfile);
  }, [initialProfile]);

  if (!isOpen) return null;

  const toggleArrayValue = (field: 'allergies' | 'healthConditions', value: string) => {
    setForm((prev) => {
      const current = prev[field] as string[];
      const hasValue = current.includes(value);
      const next = hasValue ? current.filter((item) => item !== value) : [...current, value];
      return { ...prev, [field]: next } as UserProfile;
    });
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (!form.name.trim()) {
      setError('Please enter your name to continue.');
      return;
    }

    if (form.allergies.length === 0) {
      setError('Please select at least one allergy option.');
      return;
    }

    if (form.healthConditions.length === 0) {
      setError('Please select at least one health condition option.');
      return;
    }

    setError('');
    onSave({ ...form, name: form.name.trim() });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-soft">
        <h2 className="text-2xl font-bold text-health-700">Create Your Health Profile</h2>
        <p className="mt-1 text-sm text-slate-600">This profile is saved locally in your browser.</p>

        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">Name</span>
            <input
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-health-500"
              placeholder="Enter your name"
            />
          </label>

          <fieldset>
            <legend className="mb-2 text-sm font-semibold text-slate-700">Food Allergies</legend>
            <div className="grid gap-2 sm:grid-cols-2">
              {ALLERGY_OPTIONS.map((allergy) => (
                <label key={allergy} className="flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={form.allergies.includes(allergy)}
                    onChange={() => toggleArrayValue('allergies', allergy)}
                  />
                  {allergy}
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="mb-2 text-sm font-semibold text-slate-700">Dietary Preference</legend>
            <div className="flex gap-4 text-sm">
              {['None', 'Vegetarian'].map((item) => (
                <label key={item} className="flex items-center gap-2 text-slate-700">
                  <input
                    type="radio"
                    name="dietaryPreference"
                    checked={form.dietaryPreference === item}
                    onChange={() =>
                      setForm((prev) => ({ ...prev, dietaryPreference: item as UserProfile['dietaryPreference'] }))
                    }
                  />
                  {item}
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="mb-2 text-sm font-semibold text-slate-700">Health Conditions</legend>
            <div className="grid gap-2 sm:grid-cols-2">
              {HEALTH_CONDITION_OPTIONS.map((condition) => (
                <label key={condition} className="flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={form.healthConditions.includes(condition)}
                    onChange={() => toggleArrayValue('healthConditions', condition as HealthCondition)}
                  />
                  {condition}
                </label>
              ))}
            </div>
          </fieldset>

          {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-health-500 px-4 py-2 text-sm font-semibold text-white hover:bg-health-700"
            >
              Save Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
