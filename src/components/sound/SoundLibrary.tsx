// "use client" should ensure that this file is treated as client-side only in Next.js
"use client";

export class SoundPlayer {
  audio: HTMLAudioElement;
  soundLibrary: { [key: string]: string };

  constructor() {
    if (typeof window === "undefined") {
      throw new Error("SoundPlayer can only be instantiated in the browser.");
    }

    console.log("Making new sound player");
    this.audio = new Audio();
    this.soundLibrary = {
      short: "/sounds/short_beep.wav",
    };
    this.loadDefaultSound();
  }

  // Load the default sound
  loadDefaultSound() {
    this.audio.src = this.soundLibrary.short;
    this.audio.load();
    console.log("Loaded sound to ", this.audio);
  }

  // Load a specific sound
  loadSound(soundName: string) {
    const soundPath = this.soundLibrary[soundName];
    if (soundPath) {
      this.audio.src = soundPath;
      this.audio.load();
    } else {
      console.error("Sound not found:", soundName);
    }
  }

  // Play the loaded sound
  play() {
    this.audio.play().catch((e) => console.error("Failed to play sound:", e));
  }

  // Pause the currently playing sound
  pause() {
    this.audio.pause();
  }

  // Set or change the volume
  setVolume(volumeLevel: number) {
    if (volumeLevel >= 0 && volumeLevel <= 1) {
      this.audio.volume = volumeLevel;
    } else {
      console.error("Volume must be between 0 and 1.");
    }
  }
}

// Instantiating the sound player
export const soundPlayer = (() => {
  if (typeof window !== "undefined") {
    return new SoundPlayer();
  }
  // Optionally handle server-side or return a dummy/fallback object
  return null;
})();
