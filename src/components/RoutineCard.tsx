// "use client";

import React from "react";
import { Routine } from "../models/workout"; // Assume types are defined in this file or import from the correct location
// import { useRoutine } from "@/context/RoutineContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface RoutineCardProps {
  onSelect?: (routine: Routine) => void; // Optional onSelect callback function
  routine: Routine;
  children: any;
}

const RoutineCard: React.FC<RoutineCardProps> = ({
  routine,
  onSelect,
  children,
}) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-4 m-4 relative hover:bg-gray-100">
      <div className="absolute top-4 right-4 flex space-x-2">
        <button
          onClick={() => {
            onSelect(routine);
          }}
          className="text-4xl font-semibold p-4 rounded-full text-black hover:bg-gray-200"
        >
          ▶️
        </button>
      </div>
      <h4 className="text-md font-bold text-gray-900">{routine.name}</h4>
      <p className="text-gray-600">{routine.description}</p>
      <p className="text-gray-600">{routine.id.slice(-6)}</p>
      <div className="mt-2 text-gray-400">
        <p>Prepare: {routine.routine.Prepare.duration / 1000} seconds</p>
        <p>Work: {routine.routine.Work.duration / 1000} seconds</p>
        <p>Rest: {routine.routine.Rest.duration / 1000} seconds</p>
        <p>Cycles: {routine.routine.Cycles.value}</p>
        <p>Sets: {routine.routine.Sets.value}</p>
        <p>
          Rest Between Steps: {routine.routine.RestBetweenSteps.duration / 1000}{" "}
          seconds
        </p>
        <p>Cool Down: {routine.routine.CoolDown.duration / 1000} seconds</p>
      </div>

      {children}
    </div>
  );
};

export default RoutineCard;
