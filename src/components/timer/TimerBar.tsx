import React, { useState, useEffect } from "react";

type TimerBarProps = {
  currentTime: number;
  totalTime: number;
  color: string;
};

const TimerBar: React.FC<TimerBarProps> = ({
  currentTime,
  totalTime,
  color,
}) => {
  const [widthPercentage, setWidthPercentage] = useState<number>(100);

  useEffect(() => {
    const percentage = (currentTime / totalTime) * 100;
    setWidthPercentage(percentage > 0 ? percentage : 0);
  }, [currentTime, totalTime]);

  return (
    <div className="h-4 bg-gray-200 rounded">
      <div
        className={`h-full rounded ${color}`}
        style={{ width: `${widthPercentage}%` }}
      ></div>
    </div>
  );
};

export default TimerBar;
