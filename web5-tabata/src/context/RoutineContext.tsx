"use client";

import React, { createContext, useContext, useState } from "react";
import { Routine } from "@/models/workout"; // Make sure the path is correct

interface RoutineContextType {
  routine: Routine | null;
  setRoutine: (routine: Routine | null) => void;
}

export const RoutineContext = createContext<RoutineContextType | undefined>(
  undefined,
);

export const RoutineProvider: React.FC = ({ children }) => {
  const [routine, setRoutine] = useState<Routine | null>(null);

  return (
    <RoutineContext.Provider value={{ routine, setRoutine }}>
      {children}
    </RoutineContext.Provider>
  );
};

export const useRoutine = () => {
  const context = useContext(RoutineContext);
  if (context === undefined) {
    throw new Error("useRoutine must be used within a RoutineProvider");
  }
  return context;
};
