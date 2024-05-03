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
  tickHandler: () => void;

  constructor(tickHandler: () => void) {
    this._totalTime = 0;
    this._remainingTime = 0;
    this._isPlaying = false;
    this._finished = false;
    this._timerId = crypto.randomUUID();
    this.tickHandler = tickHandler;
    this._intervalId = null;
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

  play() {
    if (!this._isPlaying && this._remainingTime > 0) {
      this._isPlaying = true;
      this._intervalId = setInterval(() => {
        if (this._remainingTime > 0) {
          this._remainingTime -= 10; // Decrease by 10 milliseconds each tick
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
    if (this._isPlaying && this._intervalId) {
      clearInterval(this._intervalId);
      this._intervalId = null;
      this._isPlaying = false;

      console.log("set is playing  to false");
    }
  }

  setTime(n: number) {
    this._totalTime = n;
    this._remainingTime = n;
  }

  setFinished() {
    this._isPlaying = false;
    this._finished = true;
  }

  reset() {
    this._totalTime = 0;
    this._remainingTime = 0;
    this._isPlaying = false;
    if (this._intervalId) clearInterval(this._intervalId);
  }
}

export default Timer;
