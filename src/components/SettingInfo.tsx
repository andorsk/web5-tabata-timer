import React from "react";
import VersionInfo from "@/components/VersionInfo";
import { useSelector } from "react-redux";
import { Web5State } from "@/lib/actions/web5";

const SettingsInfo = () => {
  const web5state = useSelector((state: Web5State) => state);

  return (
    <div className="bg-white text-black rounded-lg shadow-md p-4">
      <div className="info">
        <p className="text-lg font-semibold mb-2">Settings</p>
        <p className="mb-2">DID: {web5state.did}</p>
        <VersionInfo />
      </div>
    </div>
  );
};

export default SettingsInfo;
