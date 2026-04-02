import { UserMode, UserProfile } from '@/types/profile';

const PROFILE_KEY = 'barcodebaba_profile';
const MODE_KEY = 'barcodebaba_mode';

const hasWindow = () => typeof window !== 'undefined';

export function saveProfile(profile: UserProfile): void {
  if (!hasWindow()) return;
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export function loadProfile(): UserProfile | null {
  if (!hasWindow()) return null;

  const raw = localStorage.getItem(PROFILE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as UserProfile;
  } catch {
    return null;
  }
}

export function saveMode(mode: UserMode): void {
  if (!hasWindow()) return;
  localStorage.setItem(MODE_KEY, mode);
}

export function loadMode(): UserMode | null {
  if (!hasWindow()) return null;
  const mode = localStorage.getItem(MODE_KEY);
  if (mode === 'baby' || mode === 'general' || mode === 'elderly') {
    return mode;
  }
  return null;
}
