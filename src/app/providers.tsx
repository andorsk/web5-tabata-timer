"use client";

import { Web5Provider } from "@/context/Web5Context";
import { RoutineProvider } from "@/context/RoutineContext";
import { TimerProvider } from "@/context/TimerContext";

export function Providers({ children }) {
  return (
    <Web5Provider>
      <TimerProvider>
        <RoutineProvider>{children}</RoutineProvider>
      </TimerProvider>
    </Web5Provider>
  );
}
