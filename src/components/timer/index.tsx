import TimerBar from "./TimerBar";

export { TimerBar };

export type TimerState = {
  isPlaying: boolean;
  remainingTime: number;
  id: string;
};

class Timer {
  private _totalTime: number = 0;
  private _remainingTime: number = 0;
  private _isPlaying: boolean;
  private _timerId: string;
  private _finished: boolean = false;
  private _intervalId: any;
  private _timeStarted: number;
  private _targetTime: number;
  tickHandler: () => void;

  constructor(tickHandler: () => void) {
    this._totalTime = 0;
    this._remainingTime = 0;
    this._isPlaying = false;
    this._finished = false;
    this._timerId = crypto.randomUUID();
    this.tickHandler = tickHandler;
    this._intervalId = null;
    this._timeStarted = 0;
    this._targetTime = 0;
  }

  get totalTime() {
    return this._totalTime;
  }

  get remainingTime() {
    return this._remainingTime;
  }

  get isPlaying() {
    return this._isPlaying;
  }

  get timerId() {
    return this._timerId;
  }

  get finished() {
    return this._finished;
  }

  computeTargetTime(from: Date, n: number) {
    this._targetTime = from + n; // Set the target time by adding n milliseconds to the current time.
  }

  play() {
    if (!this._isPlaying && this._remainingTime > 0) {
      this._isPlaying = true;
      const now = Date.now();
      this._startTime = now;
      this.computeTargetTime(this._startTime, this._remainingTime);
      this._intervalId = setInterval(() => {
        if (this._remainingTime > 0) {
          const currentTime = Date.now();
          this._remainingTime = this._targetTime - currentTime;
          this.update();
        } else {
          this.setFinished();
        }
      }, 10); // Tick every 10 milliseconds
    }
  }

  update() {
    if (this.tickHandler) {
      this.tickHandler();
    }
  }

  state(): TimerState {
    return {
      remainingTime: this._remainingTime,
      isPlaying: this._isPlaying,
      id: this._timerId,
    };
  }

  toggle() {
    if (this._isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  pause() {
    if (this._isPlaying) {
      console.log("pausing");
      if (this._intervalId) {
        clearInterval(this._intervalId);
      }
      this._intervalId = null;
      this._isPlaying = false;
    }
  }

  setTime(n: number) {
    this._remainingTime = n;
    const now = Date.now();

    this._startTime = now;
    this.computeTargetTime(this._startTime, this._remainingTime);
  }

  setFinished() {
    this._isPlaying = false;
    this._finished = true;
  }

  reset() {
    this._totalTime = 0;
    this._remainingTime = 0;
    this._isPlaying = false;
    console.log("setting false");
    if (this._intervalId) clearInterval(this._intervalId);
  }
}

export default Timer;
