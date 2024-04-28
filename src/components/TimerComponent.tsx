import React, { useEffect, useState } from "react";

interface TimerComponentProps {
  durationInSeconds: number;
}

const TimerComponent: React.FC<TimerComponentProps> = ({
  durationInSeconds,
}) => {
  const [timeLeft, setTimeLeft] = useState(durationInSeconds);

  useEffect(() => {
    // Start the timer
    const timer = setInterval(() => {
      setTimeLeft((prevTimeLeft) => {
        if (prevTimeLeft === 0) {
          clearInterval(timer);
          // Optionally, you can trigger an action here when the timer ends
          return 0;
        }
        return prevTimeLeft - 1;
      });
    }, 1000);

    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(timer);
  }, [durationInSeconds]);

  // Format the time to display minutes and seconds
  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return <div>{formatTime(timeLeft)}</div>;
};

export default TimerComponent;
