/**
 * Utility for the Web Speech API
 */

export function speakText(text: string) {
  if (!('speechSynthesis' in window)) {
    console.warn("Web Speech API not supported in this browser.");
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  
  // Try to find an English voice, preferably natural sounding
  const voices = window.speechSynthesis.getVoices();
  const englishVoices = voices.filter(v => v.lang.startsWith('en'));
  if (englishVoices.length > 0) {
    // Prefer Google or premium voices if available
    const preferred = englishVoices.find(v => v.name.includes('Google') || v.name.includes('Premium'));
    utterance.voice = preferred || englishVoices[0];
  }

  // Adjust parameters for better accessibility
  utterance.rate = 0.9; // Slightly slower
  utterance.pitch = 1.0;
  utterance.volume = 1.0;

  window.speechSynthesis.speak(utterance);
}

export function stopSpeech() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
