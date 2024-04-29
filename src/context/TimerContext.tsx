import React, { createContext, useContext, useEffect, useState } from "react";

const TimerContext = createContext();

export const useTimer = () => useContext(TimerContext);

type TimerState = {
  elapsedTime: number;
  totalTime: number;
  timerStarted: string;
  timerEnded: string;
};

export const TimerProvider = ({ children }) => {
  const [stepTime, setStepTime] = useState(0);
  const [state, setState] = useState<TimerState>({
    elapsedTime: 0,
    totalTime: 0,
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

  const startTimers = (totalSeconds) => {
    setState({ elapsedTime: 0, totalTime: totalSeconds });
    setIsPaused(false);
  };

  const startStepTimer = (seconds) => {
    setStepTime(seconds);
  };

  const setTimeElapsed = (seconds) => {
    state.elapsedTime = seconds;
  };

  const setTotalTime = (seconds) => {
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
        elapsedTime,
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
