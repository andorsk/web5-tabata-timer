import React, { useState, useEffect } from "react";
import { initWeb5, Web5State } from "@/lib/actions/web5";
import { loginRequest, loginSuccess, loginFailure } from "@/lib/actions/auth";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/lib/reducers";

type LoginScreenProps = {};

// TODO: Remember me needs to be implemented better.
const LoginScreen: React.FC<LoginScreenProps> = () => {
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);

  const [error, setError] = useState("");
  const dispatch = useDispatch();

  const web5state = useSelector((state: RootState) => state.web5);
  const authState = useSelector((state: RootState) => state.auth);

  const load = async () => {
    dispatch(loginRequest());
    initWeb5(password, dispatch);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    load();
  };

  useEffect(() => {
    const savedPassword = localStorage.getItem("password");
    if (savedPassword) {
      setPassword(savedPassword);
      load();
    }
  }, [password]);

  useEffect(() => {
    if (web5state.error) {
      console.log("failed to load web5", web5state.error);
      const errorString = `${web5state.error}`;
      dispatch(loginFailure(errorString));
      setError("failed to load web5: " + errorString);
    }
    if (web5state.loaded) {
      dispatch(loginSuccess());
      if (rememberMe) {
        localStorage.setItem("password", password);
      }
    }
  }, [web5state]);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-full max-w-xs">
        <form
          onSubmit={handleSubmit}
          className="shadow-md rounded px-8 pt-6 pb-8 mb-4"
        >
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Enter your password. If this is your first time, set your password
              now..
            </label>
            {web5state.loading && <p className="text-red-500 mb-4">Loading</p>}

            <input
              className="shadow appearance-none border rounded w-full py-2 mb-4 mt-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password. If this is your first time, set your password now..."
            />
            <label className="">
              <input
                type="checkbox"
                onChange={() => setRememberMe(!rememberMe)}
                checked={rememberMe}
              />{" "}
              Remember Me?
            </label>
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginScreen;
