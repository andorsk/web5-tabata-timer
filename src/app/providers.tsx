"use client";

import React, { ReactNode } from "react";
import { Web5Provider } from "@/context/Web5Context";
import { Provider } from "react-redux";
import { store } from "@/lib/store";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <Web5Provider>{children}</Web5Provider>
    </Provider>
  );
}
