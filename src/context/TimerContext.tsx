import React, { createContext, useContext, useEffect, useState } from "react";

const TimerContext = createContext();

export const useTimer = () => useContext(TimerContext);

export const TimerProvider = ({ children }) => {
  const [globalTime, setGlobalTime] = useState(0);
  const [stepTime, setStepTime] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timeDone, setTimeDone] = useState(0);
  const [totalTime, setTotalTime] = useState(0);

  useEffect(() => {
    const globalInterval = setInterval(() => {
      setTimeDone((prevGlobalTime) => {
        const newTimeDone = prevGlobalTime + 1;
        setTimeLeft((prevTimeLeft) => Math.max(totalTime - newTimeDone, 0)); // Update timeLeft
        return newTimeDone;
      });
    }, 1000);

    const stepInterval = setInterval(() => {
      setStepTime((prevStepTime) => Math.max(prevStepTime - 1, 0)); // Decrement stepTime
    }, 1000);

    return () => {
      clearInterval(globalInterval);
      clearInterval(stepInterval);
    };
  }, [totalTime]); // Add totalTime as a dependency

  // Function to start the timers
  const startTimers = (totalSeconds) => {
    setTotalTime(totalSeconds);
    setTimeLeft(totalSeconds);
    setTimeDone(0);
  };

  const startStepTimer = (seconds) => {
    setStepTime(seconds);
  };

  return (
    <TimerContext.Provider
      value={{
        globalTime,
        stepTime,
        timeLeft,
        timeDone,
        totalTime,
        startTimers,
        startStepTimer,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
};
