"use client";

import React, { useState, useEffect } from "react";

import LoginScreen from "@/pages/LoginScreen";
import LoadingScreen from "@/pages/LoadingScreen";
import RootLayout from "@/layouts/RootLayout";
import "@/styles/globals.css";

import { useSelector } from "react-redux";
import { RootState } from "@/lib/reducers";

function Web5TabataApp({ Component, pageProps }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPasswordError, setPasswordError] = useState(false);

  // check states
  const web5state = useSelector((state: RootState) => state.web5);
  const authState = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    setIsLoaded(web5state.loaded);
  }, [web5state]);

  return (
    <div>
      {!authState.isAuthenticated && <LoginScreen />}
      {authState.isAuthenticated && web5state.loaded && (
        <Component {...pageProps} />
      )}
    </div>
  );
}

function App({ Component, pageProps }) {
  return (
    <RootLayout>
      <Web5TabataApp Component={Component} pageProps={pageProps} />
    </RootLayout>
  );
}

export default App;
