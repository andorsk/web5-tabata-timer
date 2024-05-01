"use client";

import React, { ReactNode } from "react";
import { Web5Provider } from "@/context/Web5Context";
import { WorkoutSessionProvider } from "@/context/WorkoutSessionContext";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <Web5Provider>
      <WorkoutSessionProvider>{children}</WorkoutSessionProvider>
    </Web5Provider>
  );
}
