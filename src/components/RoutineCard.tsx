// "use client";

import React from "react";
import { Routine } from "../models/workout"; // Assume types are defined in this file or import from the correct location
import { useRouter } from "next/navigation";
import Link from "next/link";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ShareIcon from "@mui/icons-material/Share";

interface RoutineCardProps {
  onSelect?: (routine: Routine) => void; // Optional onSelect callback function
  onDelete?: (routine: Routine) => void;
  onEdit?: (routine: Routine) => void;
  onShare?: (routine: Routine) => void;
  routine: Routine;
  children: any;
}

const RoutineCard: React.FC<RoutineCardProps> = ({
  routine,
  onSelect,
  onDelete,
  children,
  onEdit,
}) => {
  const config = routine.config;
  return (
    <div className="bg-white shadow-lg rounded-lg p-4 m-4 relative hover:bg-gray-100">
      <div className="absolute top-4 right-4 flex space-x-2">
        <div>
          <button
            onClick={() => {
              if (onSelect && routine) {
                onSelect(routine);
              }
            }}
          >
            <PlayArrowIcon />
          </button>
          <button
            onClick={() => {
              if (onEdit && routine) {
                onEdit(routine);
              }
            }}
          >
            <EditIcon />
          </button>
          <button
            onClick={() => {
              if (onDelete && routine) {
                onDelete(routine);
              }
            }}
          >
            <DeleteIcon />
          </button>
          <button>
            <ShareIcon />
          </button>
        </div>
      </div>
      <h4 className="text-md font-bold text-gray-900">{routine.name}</h4>
      <p className="text-gray-600">{routine.description}</p>
      <p className="text-gray-600">{routine?.id?.slice(-6)}</p>
      <div className="mt-2 text-gray-400">
        <p>Prepare: {config.Prepare.duration / 1000} seconds</p>
        <p>Work: {config.Work.duration / 1000} seconds</p>
        <p>Rest: {config.Rest.duration / 1000} seconds</p>
        <p>Cycles: {config.Cycles.value}</p>
        <p>Sets: {config.Sets.value}</p>
        <p>
          Rest Between Steps: {config.RestBetweenSteps.duration / 1000} seconds
        </p>
        <p>Cool Down: {config.CoolDown.duration / 1000} seconds</p>
      </div>
      {children}
    </div>
  );
};

export default RoutineCard;
