export class VibrationPlayer {
  constructor() {
    if (typeof window === "undefined") {
      throw new Error(
        "VibrationPlayer can only be instantiated in the browser.",
      );
    }
  }

  // Vibrate for a specific duration
  vibrate(duration: number) {
    if ("vibrate" in navigator) {
      navigator.vibrate(duration);
    }
  }

  // Vibrate for a short duration
  shortVibrate() {
    this.vibrate(200);
  }
}

export const vibrationPlayer = (() => {
  if (typeof window !== "undefined") {
    return new VibrationPlayer();
  }
  return null;
})();
