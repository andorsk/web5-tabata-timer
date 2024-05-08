import React, { useState, useEffect } from "react";

const WakeLock: React.FC = () => {
  const [wakeLock, setWakeLock] = useState<WakeLockSentinel | null>(null);

  const requestWakeLock = async () => {
    try {
      console.log("requesting wakelock");
      const newWakeLock = await navigator.wakeLock.request("screen");
      newWakeLock.addEventListener("release", () => {
        console.log("Wake Lock was released");
      });
      console.log("Wake Lock is active");
      setWakeLock(newWakeLock);
    } catch (err: any) {
      console.error(`${err.name}, ${err.message}`);
    }
  };

  const releaseWakeLock = () => {
    console.log("Releasing wakeLock");
    if (wakeLock) {
      wakeLock.release();
      setWakeLock(null);
      console.log("Wake Lock released");
    }
  };

  useEffect(() => {
    if ("wakeLock" in navigator) {
      requestWakeLock();
    } else {
      console.error("Wake lock is not supported by this browser.");
    }
  }, []);

  return <></>;
};

export default WakeLock;
