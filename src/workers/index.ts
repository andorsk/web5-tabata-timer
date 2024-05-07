"use strict";

self.addEventListener("sync", (event) => {
  console.log("got sync message", event);
  // @ts-ignore
  if (event.tag === "timer-sync") {
    console.log("got timer sync message");
    const logMessage = (e: any) => {
      console.log("got timer", e);
    };
    // @ts-ignore
    event.waitUntil(logMessage);
  }
});
