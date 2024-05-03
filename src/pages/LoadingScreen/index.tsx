import React, { useState, useEffect } from "react";
import { initWeb5, Web5State } from "@/lib/actions/web5";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/lib/reducers";

const LoadingScreen = ({ setIsLoaded }) => {
  const [error, setError] = useState("");
  const [password, setPassword] = useState("asdf");

  const dispatch = useDispatch();
  const web5state = useSelector((state: RootState) => state.web5);

  useEffect(() => {
    console.log(web5state.error);
    if (!web5state.loaded && !web5state.error) {
      const load = async () => {
        initWeb5(password, dispatch);
      };
      load();
    }
  }, []);

  useEffect(() => {
    if (web5state.error) {
      console.log("failed to load web5", web5state.error);
      const errorString = `${web5state.error}`;
      setError("failed to load web5: " + errorString);
    }
  }, [web5state.error]);

  return (
    <div className="flex justify-center items-center h-screen p-5">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Unlocking your DWN</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="spinner border-t-4 border-gray-200 rounded-full w-12 h-12"></div>
      </div>
    </div>
  );
};

export default LoadingScreen;
