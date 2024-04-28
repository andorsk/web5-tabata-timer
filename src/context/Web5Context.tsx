"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Web5 } from "@web5/api";

interface Web5ContextType {
  web5: any; // Define more specific types if available
  aliceDid: string | null;
  initWeb5: () => Promise<void>;
}

export const Web5Context = createContext<Web5ContextType | undefined>(
  undefined,
);

export const Web5Provider: React.FC = ({ children }) => {
  const [web5, setWeb5] = useState<Web5 | null>(null);
  const [did, setDid] = useState<string | null>(null);

  useEffect(async () => {
    const { web51, did: did1 } = await Web5.connect();
    setWeb5(web51);
    setDid(did1);
  }, []); // Initialize on mount

  return (
    <Web5Context.Provider value={{ web5, setWeb5 }}>
      {children}
    </Web5Context.Provider>
  );
};

export const useRoutine = () => {
  const context = useContext(Web5Context);
  if (context === undefined) {
    throw new Error("useRoutine must be used within a Web5Provider");
  }
  return context;
};
