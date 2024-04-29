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

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setStepTime((prevStepTime) => Math.max(prevStepTime - 1, 0));
      setState((prevState) => ({
        ...prevState,
        elapsedTime: prevState.elapsedTime + 1,
      }));
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

  const endTimer = () => {};

  return (
    <TimerContext.Provider
      value={{
        stepTime,
        elapsedTime,
        totalTime,
        timeLeft,
        endTimer,
        startTimers,
        startStepTimer,
        setTimeElapsed,
        setTotalTime,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
};
