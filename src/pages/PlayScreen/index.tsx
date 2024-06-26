"use client";

import FinishedDetails from "@/components/play/FinishedDetails";
import { RootState } from "@/lib/reducers";
import { WorkoutState } from "@/lib/reducers/workout";
import { formatDuration } from "@/lib/time";
import { Step } from "@/models/workout";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { updateSession } from "@/lib/store/dwn/session";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import HomeIcon from "@mui/icons-material/Home";
import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import "./styles.css";
import { Web5State } from "@/lib/actions/web5";

function StepView() {
  const workoutState = useSelector((state: RootState) => state.workout);
  const web5state = useSelector((state: RootState) => state.web5);
  const [updating, isUpdating] = useState(false);

  const [currentStep, setCurrentStep] = useState<Step>();
  const [currentStepIndex, setCurrentStepIndex] = useState<number>();
  const selectedStepRef = useRef<HTMLButtonElement>(null);

  const handleClickedStep = (index: number) => {
    if (workoutState.manager?.workout?.steps.length === 0) {
      return;
    }
    console.log("setting step to", index);
    workoutState.manager?.setStep(index);
  };

  useEffect(() => {
    // Scroll to the selected step when it changes
    if (selectedStepRef.current) {
      selectedStepRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [currentStepIndex]);

  useEffect(() => {
    setCurrentStepIndex(workoutState?.manager.currentStep);
    setCurrentStep(
      workoutState?.manager.workout?.steps[workoutState?.manager.currentStep],
    );
  }, [workoutState]);

  const whiteListedNames = [
    "Rest Between Sets",
    "Cool Down",
    "Preparation",
    "Finish",
  ];

  return (
    <div className="overflow-y-auto">
      <div className="justify-center items-center">
        {workoutState?.manager.workout?.steps.map((step, index) => (
          <button
            ref={index === currentStepIndex ? selectedStepRef : null}
            key={index}
            onClick={() => handleClickedStep(index)}
            className={`w-full rounded ${
              index === currentStepIndex
                ? "bg-blue-500 text-white p-5"
                : "bg-transparent p-1"
            }`}
            style={{
              minHeight: "40px", // Set a fixed height for each button
              marginBottom: "0px", // Add some space between buttons
              outline: "none", // Remove default outline on focus
              border: "1px solid black", // Add border around each button
              boxShadow: `0 2px 4px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.1)`, // Add box shadow for depth
              background:
                index === currentStepIndex
                  ? "rgba(0, 0, 0, 0.1)"
                  : "transparent", // Semi-transparent overlay
            }}
          >
            {!whiteListedNames.includes(step.name) && (
              <>
                <span>
                  {step.set + 1}.{step.cycle + 1}{" "}
                </span>
              </>
            )}
            {step.name}
          </button>
        ))}
      </div>
    </div>
  );
}

function Footer() {
  const workoutState = useSelector((state: RootState) => state.workout);
  const [currentStep, setCurrentStep] = useState<Step>();
  const router = useRouter();

  useEffect(() => {
    setCurrentStep(
      workoutState?.manager.workout?.steps[workoutState?.manager.currentStep],
    );
    if (!workoutState.manager.ready) {
      router.push("/");
    }
  }, [workoutState]);

  return (
    <div
      className={`flex justify-between items-center p-4 border-2 border-black border-solid ${currentStep?.color}`}
    >
      <button
        onClick={() => workoutState?.manager.previousStep()}
        className="rounded text-black"
      >
        <ArrowLeftIcon fontSize="large" />
      </button>
      <div>
        <span>
          Cycle:{" "}
          {(workoutState?.manager.workout?.steps?.[
            workoutState?.manager?.currentStep
          ]?.cycle || 0) + 1 || 0}
          /{workoutState?.manager?.workout?.routine?.config?.Cycles?.value || 0}
        </span>{" "}
        <br />
        <span>
          Sets:{" "}
          {(workoutState?.manager?.workout?.steps?.[
            workoutState?.manager?.currentStep
          ]?.set || 0) + 1 || 0}
          /{workoutState?.manager?.workout?.routine?.config?.Sets?.value || 0}
        </span>
      </div>
      <button
        onClick={() => workoutState?.manager?.nextStep()}
        className="p-2 rounded text-black"
      >
        <ArrowRightIcon fontSize="large" />
      </button>
    </div>
  );
}

// @ts-ignore
function Header({ handleToggleWorkout, router }) {
  const [currentStep, setCurrentStep] = useState<Step>();
  const workoutState = useSelector((state: RootState) => state.workout);

  useEffect(() => {
    setCurrentStep(
      workoutState?.manager.workout?.steps[workoutState?.manager.currentStep],
    );
  }, [workoutState]);

  return (
    <div className={`flex flex-col w-full`}>
      <div className="m-2 absolute">
        Session: {workoutState?.manager?.workout?.id?.slice(-6)}
      </div>
      <div className="flex justify-between items-center p-4 ">
        <div className="flex">
          <button
            className="p-2 text-4xl rounded"
            onClick={handleToggleWorkout}
          >
            {workoutState?.manager.timer?.isPlaying ? (
              <PauseIcon />
            ) : (
              <PlayArrowIcon />
            )}
          </button>
          <button
            className="p-2 text-4xl rounded"
            onClick={() => router.push("/")}
          >
            <HomeIcon />
          </button>
        </div>
        <div className="p-4 text-center font-bold text-2xl">
          {workoutState?.manager.timeLeft !== undefined
            ? formatDuration(
                Math.floor(workoutState.manager.timeLeft / 1000 ?? 0),
              )
            : "00:00"}
        </div>
      </div>
      <div className="text-center mb-4">
        <h1 className="text-3xl font-bold">{currentStep?.name}</h1>
        <h1 className="text-9xl pb-10 font-bold">
          {Math.floor(
            (workoutState?.manager.timer?.remainingTime ?? 0) / 1000,
          ).toString()}
        </h1>
        <p className="text-1xl font-bold">
          Set: {(currentStep?.set || 0) + 1} Cycle:{" "}
          {(currentStep?.cycle || 0) + 1}
        </p>
      </div>
    </div>
  );
}

export default function PlayScreen() {
  const web5state = useSelector((state: RootState) => state.web5);
  const authState = useSelector((state: RootState) => state.auth);
  const workoutState = useSelector((state: RootState) => state.workout);
  const router = useRouter();
  const dispatch = useDispatch();
  const [currentStep, setCurrentStep] = useState<Step>();

  useEffect(() => {
    setCurrentStep(
      workoutState?.manager.workout?.steps[workoutState?.manager.currentStep],
    );
    if (!workoutState.manager.ready) {
      alert("no workout set. routing you to select first");
      router.push("/");
    }
  }, [workoutState]);

  const toggleWorkout = async () => {
    if (!workoutState.manager.started) {
      console.log("starting workout for the first time");
      //await workoutState.manager.startWorkout(web5state.web5);
    } else {
      workoutState.manager.toggleWorkout();
    }
  };

  return (
    <div
      className={`play-container ${
        currentStep?.color || "bg-blue-500"
      } h-screen`}
    >
      {!workoutState.manager.ready ? (
        <div className="p-4">Not ready set</div>
      ) : (
        <div className="h-screen">
          {!workoutState?.manager?.workout?.completed ? (
            <>
              <div>
                <Header router={router} handleToggleWorkout={toggleWorkout} />
              </div>
              <div className="h-3/6 overflow-y-auto">
                <StepView />
                <div className="h-3/6"></div>
              </div>
              <div className="footer">
                {" "}
                <Footer />{" "}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-screen overflow-hidden">
              <div className="text-center rounded p-4 border-gray-500 shadow-lg border m-4">
                <h1 className="text-3xl mb-4 rounded border-gray-500">
                  Finished!
                </h1>
                <div className="m-4">
                  <FinishedDetails workoutState={workoutState} />
                  <button
                    className="p-2 text-4xl rounded"
                    onClick={() => router.push("/")}
                  >
                    <HomeIcon />
                  </button>
                  <button
                    className="p-2 text-4xl rounded"
                    onClick={() => {
                      workoutState?.manager?.resetWorkout();
                      console.log("starting workout on refresh");
                      workoutState?.manager?.startWorkout();
                      workoutState?.manager?.unpauseWorkout();
                    }}
                  >
                    <RefreshIcon />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
