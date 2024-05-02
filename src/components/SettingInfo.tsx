import React from "react";
import VersionInfo from "@/components/VersionInfo";

const SettingsInfo = ({ did }) => {
  return (
    <div className="bg-white text-black rounded-lg shadow-md p-4">
      <div className="info">
        <p className="text-lg font-semibold mb-2">Settings</p>
        <p className="mb-2">DID: {did}</p>
        <VersionInfo />
      </div>
    </div>
  );
};

export default SettingsInfo;
