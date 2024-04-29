import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

type TimerContextType = {
  stepTime: number;
  totalTime: number;
  timeLeft: number;
  startTimers: (totalSeconds: number) => void;
  startStepTimer: (seconds: number) => void;
  setTimeElapsed: (seconds: number) => void;
  setTotalTime: (seconds: number) => void;
  setIsPaused: React.Dispatch<React.SetStateAction<boolean>>;
};
// const TimerContext = createContext();
const TimerContext = createContext<TimerContextType | undefined>(undefined);

export const useTimer = (): TimerContextType => {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error("useTimer must be used within a TimerProvider");
  }
  return context;
};

type TimerState = {
  elapsedTime: number;
  totalTime: number;
  timerStarted?: number;
  timerEnded?: number;
};

export const TimerProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [stepTime, setStepTime] = useState(0);
  const [state, setState] = useState<TimerState>({
    elapsedTime: 0,
    totalTime: 0,
    timerStarted: 0,
    timerEnded: 0,
  });
  const { elapsedTime, totalTime } = state;
  const [timeLeft, setTimeLeft] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const stepInterval = setInterval(() => {
      if (!isPaused) {
        setStepTime((prevStepTime) => Math.max(prevStepTime - 1, 0));
        setState((prevState) => ({
          ...prevState,
          elapsedTime: prevState.elapsedTime + 1,
        }));
      } else {
        console.log("is paused");
      }
    }, 1000);

    return () => {
      clearInterval(stepInterval);
    };
  }, []);

  useEffect(() => {
    setTimeLeft(Math.max(totalTime - (elapsedTime - stepTime), 0));
  }, [totalTime, elapsedTime, stepTime]);

  const startTimers = (totalSeconds: number) => {
    setState({ elapsedTime: 0, totalTime: totalSeconds });
    setIsPaused(false);
  };

  const startStepTimer = (seconds: number) => {
    setStepTime(seconds);
  };

  const setTimeElapsed = (seconds: number) => {
    state.elapsedTime = seconds;
  };

  const setTotalTime = (seconds: number) => {
    state.totalTime = seconds;
  };

  useEffect(() => {
    if (timeLeft === 0) {
      console.log("Timer ended");
    }
  }, [timeLeft]);

  return (
    <TimerContext.Provider
      value={{
        stepTime,
        totalTime,
        timeLeft,
        startTimers,
        startStepTimer,
        setTimeElapsed,
        setTotalTime,
        setIsPaused,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
};
