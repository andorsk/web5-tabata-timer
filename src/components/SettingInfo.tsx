import React from "react";
import VersionInfo from "@/components/VersionInfo";
import { useSelector } from "react-redux";
import { Web5State } from "@/lib/actions/web5";
import { RootState } from "@/lib/reducers";

const SettingsInfo = () => {
  const web5state = useSelector((state: RootState) => state.web5);

  return (
    <div className="rounded-lg shadow-md p-4 flex flex-wrap whitespace-normal max-w-full overflow-auto">
      <div className="info">
        <p className="text-lg font-semibold mb-2">Settings</p>
        <p className="mb-2">DID: {web5state.did}</p>
        <VersionInfo />
      </div>
    </div>
  );
};

export default SettingsInfo;
