// src/hooks/useVersion.ts
"use client";

import { useEffect, useState } from "react";

interface VersionInfo {
  commitHash: string;
  branch: string;
  commitMessage: string;
  currentDate: string;
}

const useVersion = (): VersionInfo | null => {
  const [version, setVersion] = useState<VersionInfo | null>(null);

  useEffect(() => {
    const fetchVersion = async () => {
      try {
        const response = await fetch("/version.json");
        const data: VersionInfo = await response.json();
        setVersion(data);
      } catch (error) {
        console.error("Error fetching version information:", error);
      }
    };

    fetchVersion();
  }, []);

  return version;
};

export default useVersion;
