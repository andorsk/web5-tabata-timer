"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Web5 } from "@web5/api";
import { configureProtocol } from "@/lib/store/dwn/routines";

type ProvidersProps = {
  children: ReactNode;
};

type Web5ContextType = {
  web5: any; // Define more specific types if available
  did: string | null;
  initWeb5: () => Promise<void>;
};

export const Web5Context = createContext<Web5ContextType | undefined>(
  undefined,
);

export const useWeb5 = () => {
  const context = useContext(Web5Context);
  if (context === undefined) {
    throw new Error("useWeb5 must be used within a Web5Provider");
  }
  return context;
};

export const Web5Provider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [web5, setWeb5] = useState<Web5 | null>(null);
  const [did, setDid] = useState<string | null>(null);

  const initWeb5 = async () => {
    console.log("initializing  web5");
    try {
      const { web5: connectedWeb5, did: myDid } = await Web5.connect({
        password: "asdf",
      });
      setWeb5(connectedWeb5);
      setDid(myDid);
      await configureProtocol(connectedWeb5);
      console.log("protocol configured");
    } catch (error) {
      console.error("Failed to connect to Web5:", error);
    }
  };

  useEffect(() => {
    initWeb5();
  }, []);

  return (
    <Web5Context.Provider value={{ did: did, web5: web5, initWeb5: initWeb5 }}>
      {children}
    </Web5Context.Provider>
  );
};
