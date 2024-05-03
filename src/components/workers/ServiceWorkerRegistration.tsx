import React, { useState, useEffect } from "react";

function ServiceWorkerRegistration() {
  const [registrationStatus, setRegistrationStatus] = useState("pending");

  useEffect(() => {
    // Check if the browser supports service workers
    if ("serviceWorker" in navigator) {
      // Register the service worker
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          setRegistrationStatus("success");
          console.log("Service worker registration successful:", registration);
        })
        .catch((error) => {
          setRegistrationStatus("error");
          console.error("Service worker registration failed:", error);
        });
    } else {
      setRegistrationStatus("unsupported");
    }
  }, []);

  // Render different messages based on registration status
  let message;
  switch (registrationStatus) {
    case "pending":
      message = "Registering service worker...";
      break;
    case "success":
      message = "";
      break;
    case "error":
      message = "Failed to register service worker.";
      break;
    case "unsupported":
      message = "Service workers are not supported in this browser.";
      break;
    default:
      message = "";
  }

  return <div>{message}</div>;
}

export default ServiceWorkerRegistration;
