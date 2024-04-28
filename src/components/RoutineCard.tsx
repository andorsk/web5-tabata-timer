// "use client";

import React from "react";
import { Routine } from "../models/workout"; // Assume types are defined in this file or import from the correct location
// import { useRoutine } from "@/context/RoutineContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface RoutineCardProps {
  routine: Routine;
}

const RoutineCard: React.FC<RoutineCardProps> = ({ routine }) => {
  console.log(routine.id);
  return (
    <div className="bg-white shadow-lg rounded-lg p-4 m-4 relative hover:bg-gray-100">
      <div className="absolute top-4 right-4 flex space-x-2">
        <Link href={`/playview/${routine.id}`}>
          <button className="text-lg font-semibold p-2 rounded-full bg-green-500 text-white hover:bg-green-600">
            ▶️
          </button>
        </Link>
        <button className="text-lg font-semibold p-2 rounded-full bg-gray-300 hover:bg-gray-400">
          ⋮
        </button>
      </div>
      <h2 className="text-xl font-bold text-gray-800">
        {routine.title} ({routine.name})
      </h2>
      <p className="text-gray-600">{routine.description}</p>
      <p className="text-gray-600">{routine.id.slice(-6)}</p>
      <div className="mt-2">
        <p>Prepare: {routine.routine.Prepare.duration} seconds</p>
        <p>Work: {routine.routine.Work.duration} seconds</p>
        <p>Rest: {routine.routine.Rest.duration} seconds</p>
        <p>Cycles: {routine.routine.Cycles.value}</p>
        <p>Sets: {routine.routine.Sets.value}</p>
        <p>
          Rest Between Steps: {routine.routine.RestBetweenSteps.duration}{" "}
          seconds
        </p>
        <p>Cool Down: {routine.routine.CoolDown.duration} seconds</p>
      </div>
    </div>
  );
};

export default RoutineCard;
