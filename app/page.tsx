'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ModeSelector } from '@/components/ModeSelector';
import { ProfileModal } from '@/components/ProfileModal';
import { loadMode, loadProfile, saveMode, saveProfile } from '@/lib/storage';
import { UserMode, UserProfile } from '@/types/profile';

export default function LandingPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [mode, setMode] = useState<UserMode | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setProfile(loadProfile());
    setMode(loadMode());
  }, []);

  const startScanning = () => {
    if (!profile) {
      setError('Please create your profile before scanning.');
      setIsModalOpen(true);
      return;
    }

    if (!mode) {
      setError('Please select a mode before starting.');
      return;
    }

    saveMode(mode);
    setError('');
    router.push('/scan');
  };

  const profileName = profile?.name || 'No profile created yet';

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-4 py-12">
      <header className="mb-10 text-center">
        <h1 className="text-5xl font-extrabold text-health-700">BarcodeBaba</h1>
        <p className="mt-3 text-lg font-medium text-slate-600">Smart choice vahi, jo scan kare sahi</p>
      </header>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Your Profile</h2>
            <p className="text-sm text-slate-600">{profileName}</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="rounded-xl bg-health-500 px-4 py-2 text-sm font-semibold text-white hover:bg-health-700"
          >
            {profile ? 'Edit Profile' : 'Create Profile'}
          </button>
        </div>
      </section>

      <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
        <h2 className="text-xl font-bold text-slate-900">Choose Scanning Mode</h2>
        <p className="mt-1 text-sm text-slate-600">Select one mode that matches who the food is for.</p>
        <div className="mt-4">
          <ModeSelector selected={mode} onSelect={setMode} />
        </div>
      </section>

      {error ? <p className="mt-4 text-sm font-semibold text-red-600">{error}</p> : null}

      <div className="mt-8 text-center">
        <button
          onClick={startScanning}
          className="rounded-2xl bg-health-500 px-8 py-3 text-lg font-bold text-white shadow-soft hover:bg-health-700"
        >
          Start Scanning
        </button>
      </div>

      <ProfileModal
        isOpen={isModalOpen}
        initialProfile={profile}
        onClose={() => setIsModalOpen(false)}
        onSave={(nextProfile) => {
          setProfile(nextProfile);
          saveProfile(nextProfile);
        }}
      />
    </main>
  );
}
