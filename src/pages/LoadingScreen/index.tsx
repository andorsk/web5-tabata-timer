import React, { useState, useEffect } from "react";
import { initWeb5, Web5State } from "@/lib/actions/web5";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/lib/reducers";

const LoadingScreen = ({ setIsLoaded }) => {
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const web5state = useSelector((state: RootState) => state.web5);

  useEffect(() => {
    if (!web5state.loaded) {
      const load = async () => {
        initWeb5(dispatch);
      };
      load();
    }
  }, []);

  useEffect(() => {
    if (web5state.error) {
      console.log("failed to load web5", web5state.error);
      setError(web5state.error);
    }
  }, [web5state.error]);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Loading your contexts</h1>
        <div className="spinner border-t-4 border-gray-200 rounded-full w-12 h-12"></div>
        {error && <p className="text-red-500 mb-4">{error}</p>}
      </div>
    </div>
  );
};

export default LoadingScreen;
