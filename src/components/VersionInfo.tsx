// Example usage in a component
"use client";

import React from "react";
import useVersion from "@/hooks/useVersion";

const VersionInfo = () => {
  const version = useVersion();

  return (
    <div>
      {version ? (
        <div>
          <h2>Version Information</h2>
          <p>Commit Hash: {version.commitHash}</p>
          <p>Branch: {version.branch}</p>
          <p>Commit Message: {version.commitMessage}</p>
          <p>Current Date: {version.currentDate}</p>
          <p>Repository URL: https://github.com/andorsk/web5-tabata-timer </p>
        </div>
      ) : (
        <p>Loading version information...</p>
      )}
    </div>
  );
};

export default VersionInfo;
