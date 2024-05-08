"use strict";

self.addEventListener("sync", (event) => {
  //console.log("got sync message", event);
  // @ts-ignore
  if (event.tag === "timer-sync") {
    //console.log("got timer sync message");
    const logMessage = (e: any) => {
      //  console.log("got timer", e);
    };
    // @ts-ignore
    event.waitUntil(logMessage);
  }
});

let countdown: number;
const tickInterval = 1000; // 1 second intervals

self.onmessage = (event) => {
  if (event.data.command === "start") {
    const { duration } = event.data;
    console.log("---------------------------");
    countdown = duration;
    setInterval(() => {
      countdown -= tickInterval;
      postMessage({ type: "tick", countdown });
      if (countdown <= 0) {
        //clearInterval();
        postMessage({ type: "done" });
      }
    }, tickInterval);
  } else if (event.data.command === "stop") {
    //clearInterval();
    postMessage({ type: "stopped" });
  }
};
