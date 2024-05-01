class Timer {
  private totalTime: number;
  private remainingTime: number;
  private isPlaying: boolean;
  private intervalId: NodeJS.Timeout | null;

  constructor() {
    this.totalTime = 0;
    this.remainingTime = 0;
    this.isPlaying = false;
    this.intervalId = null;
  }

  start(totalSeconds: number) {
    if (!this.isPlaying) {
      this.totalTime = totalSeconds;
      this.remainingTime = totalSeconds;
      this.isPlaying = true;
      this.intervalId = setInterval(() => {
        if (this.remainingTime > 0) {
          this.remainingTime--;
          console.log("Remaining Time:", this.remainingTime);
        } else {
          this.pause();
          console.log("Timer ended");
        }
      }, 1000);
    }
  }

  toggle() {
    this.isPlaying = !this.isPlaying;
    console.log("toggled", this.isPlaying);
    if (this.intervalId) clearInterval(this.intervalId);
  }

  pause() {
    if (this.isPlaying) {
      this.isPlaying = false;
      if (this.intervalId) clearInterval(this.intervalId);
    }
  }

  reset() {
    this.totalTime = 0;
    this.remainingTime = 0;
    this.isPlaying = false;
    if (this.intervalId) clearInterval(this.intervalId);
  }

  getRemainingTime() {
    return this.remainingTime;
  }

  isTimerPlaying() {
    return this.isPlaying;
  }
}

export default Timer;
