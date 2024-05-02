export type TimerState = {
  isPlaying: boolean;
  remainingTime: number;
  id: string;
};

export class Timer {
  totalTime = 0;
  remainingTime = 0;
  isPlaying = false;
  intervalId: null;
  timerId = "";
  tickHandler: () => void;
  finished = false;

  constructor(tickHandler: () => void) {
    this.totalTime = 0;
    this.remainingTime = 0;
    this.isPlaying = false;
    this.intervalId = null;
    this.timerId = crypto.randomUUID();
    this.tickHandler = tickHandler;
  }

  start(totalSeconds: number) {
    if (!this.isPlaying) {
      this.totalTime = totalSeconds;
      this.remainingTime = totalSeconds;
      this.isPlaying = true;
      this.intervalId = setInterval(() => {
        if (this.remainingTime > 0) {
          this.remainingTime--;
          //        console.log("Remaining Time:", this.remainingTime);
          this.update();
        } else {
          this.pause();
          console.log("Timer ended");
        }
      }, 1000);
    }
  }

  update() {
    if (this.tickHandler) {
      this.tickHandler();
    }
  }

  state(): TimerState {
    return {
      remainingTime: this.remainingTime,
      isPlaying: this.isPlaying,
      id: this.timerId,
    };
  }

  toggle() {
    this.isPlaying = !this.isPlaying;
    console.log("toggling timer");
    if (!this.isPlaying && this.intervalId) clearInterval(this.intervalId);
    this.update();
  }

  pause() {
    if (this.isPlaying) {
      this.toggle();
    }
  }

  play() {
    if (!this.isPlaying) {
      this.toggle();
    }
  }

  reset() {
    this.totalTime = 0;
    this.remainingTime = 0;
    this.isPlaying = false;
    if (this.intervalId) clearInterval(this.intervalId);
    this.update();
  }
}

export default Timer;
