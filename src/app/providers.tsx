"use client";

import React, { ReactNode } from "react";
import { Web5Provider } from "@/context/Web5Context";
import { RoutineProvider } from "@/context/RoutineContext";
import { TimerProvider } from "@/context/TimerContext";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <Web5Provider>
      <TimerProvider>
        <RoutineProvider>{children}</RoutineProvider>
      </TimerProvider>
    </Web5Provider>
  );
}
