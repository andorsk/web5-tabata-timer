"use client";

import { Web5Provider } from "@/context/Web5Context";
import { RoutineProvider } from "@/context/RoutineContext";

export function Providers({ children }) {
  return (
    <Web5Provider>
      <RoutineProvider>{children}</RoutineProvider>
    </Web5Provider>
  );
}
