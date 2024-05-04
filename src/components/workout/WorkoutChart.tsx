import React, { useState } from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import "./heatmap.css";
import { Tooltip } from "react-tippy";
import "react-tippy/dist/tippy.css";

const WorkoutChart = () => {
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [hoveredValue, setHoveredValue] = useState<string | null>(null);

  const today = new Date();
  const randomValues = getRange(200).map((index) => {
    return {
      date: shiftDate(today, -index),
      count: getRandomInt(1, 3),
    };
  });

  function shiftDate(date: Date, numDays: number) {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + numDays);
    return newDate;
  }

  function getRange(count: number) {
    return Array.from({ length: count }, (_, i) => i);
  }

  function getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function handleMouseOver(event: any, value: any) {
    const v = `${value?.date?.toISOString().slice(0, 10)} has count: ${
      value.count
    }`;
    setHoveredValue(v);
    setTooltipPosition({ x: event.clientX, y: event.clientY });
  }

  function handleMouseLeave() {
    setHoveredValue(null);
  }

  return (
    <div className="p-4 w-full overflow-hidden text-black">
      <CalendarHeatmap
        startDate={shiftDate(today, -150)}
        endDate={today}
        values={randomValues}
        onMouseOver={handleMouseOver}
        onMouseLeave={handleMouseLeave}
        classForValue={(value) => {
          if (!value) {
            return "color-empty";
          }
          return `color-github-${value.count}`;
        }}
      />
      // @ts-ignore
      <Tooltip position="bottom" />
    </div>
  );
};

export default WorkoutChart;
