"use client";

import { useSelector, useDispatch } from "react-redux";
import React, { useState, useEffect } from "react";
import { Web5 } from "@web5/api";
import { RootState } from "@/lib/reducers";
import { setRoutines } from "@/lib/actions/workout";
import { getRoutines } from "@/lib/store/dwn/routines";
import { Routine } from "@/models/workout";
import RoutineCard from "@/components/RoutineCard";
import SettingInfo from "@/components/SettingInfo";
import RoutineConfigurationForm from "@/components/configureRoutine/ConfigureRoutine";
import { useRouter } from "next/router";
import { setWorkout } from "@/lib/actions/workout";
import SettingsIcon from "@mui/icons-material/Settings";
import CloseIcon from "@mui/icons-material/Close";
import { formatDuration } from "@/lib/time";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { TimerBar } from "@/components/timer";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import InsertChartIcon from "@mui/icons-material/InsertChart";

// @ts-ignore
const loadRoutines = async (web5?: Web5 | null, dispatch: Dispatch) => {
  if (!web5) {
    throw new Error("can't load routines. web5 not loaded");
  }
  const routines = await getRoutines(web5);
  const data: Routine[] = await Promise.all(
    (routines?.records || []).map(async (v) => {
      const vv = await v.data.json();
      return { ...vv, id: v.id } as Routine;
    }),
  );
  console.log("got routines", data);
  const msg = setRoutines(data);
  dispatch(setRoutines(data));
  console.log("routines loaded", msg);
};

function CardGrid() {
  const workoutState = useSelector((state: RootState) => state.workout);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [chosenId, setChosenId] = useState("");
  const router = useRouter();

  useEffect(() => {
    workoutState.manager.setDispatcher(dispatch);
  }, []);

  const createWorkout = (r: Routine) => {
    console.log("creating workout");
    setIsLoading(true);
    workoutState.manager.setWorkout({ routine: r });
    workoutState.manager?.startWorkout();
    console.log("started workout");
    setIsLoading(false);
  };

  const enterPlayMode = () => {
    console.log("entering play mode!");
    router.push("/play");
  };

  const handleSelect = (r: Routine) => {
    // get current routine
    const curRoutineId = workoutState.manager?.workout?.routine?.id;
    setChosenId(r.id);

    if (r.id === curRoutineId) {
      // GO TO EXISTING ROUTINE
      enterPlayMode();
    } else {
      console.log("loading workout", r);
      createWorkout(r);
      enterPlayMode();
    }
    setChosenId("");

    // if play id is not the same as the existing id, update the workout
  };
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
      {workoutState.routines.map((routine) => (
        <RoutineCard
          key={routine.id}
          routine={routine}
          onSelect={handleSelect}
          children={
            isLoading &&
            chosenId === routine.id && <div className="p-4">Loading</div>
          }
        />
      ))}
    </div>
  );
}

function CurrentWorkoutCard() {
  const workoutState = useSelector((state: RootState) => state.workout);
  const name = workoutState?.manager?.workout?.routine?.name;
  const totalWorkoutTimeLeft = workoutState?.manager?.timeLeft;
  const timeLeft = workoutState?.manager?.timer?.remainingTime;
  const [formattedTimeLeft, setFormattedTimeLeft] = useState("");
  const [totalTimeLeft, setFormattedTotalTimeLeft] = useState("");
  const currentStep = workoutState?.manager?.getStep(
    workoutState?.manager?.currentStep,
  );
  const router = useRouter();

  useEffect(() => {
    if (timeLeft) {
      setFormattedTimeLeft(formatDuration(Math.floor(timeLeft / 1000 ?? 0)));
    }
    if (totalWorkoutTimeLeft) {
      setFormattedTotalTimeLeft(
        formatDuration(Math.floor(totalWorkoutTimeLeft / 1000 ?? 0)),
      );
    }
  }, [timeLeft]);

  return (
    <div
      className={`shadow-lg bg-white rounded-lg p-4 m-4 relative hover:bg-gray-100`}
    >
      <div className="mainStep">
        <button
          className={`${currentStep?.color} text-white rounded-md py-1 px-2 text-sm`}
        >
          {currentStep?.name}
        </button>
        <button className="text-black rounded-md py-1 px-2 text-sm">
          {workoutState.manager?.isWorkoutActive ? "active" : "inactive"}
        </button>
      </div>
      <div>
        <div className="flex justify-between items-center">
          <div>
            {formattedTimeLeft} {totalTimeLeft}
            <br />
            {name} Step: {currentStep?.cycle} Set: {currentStep?.set}
          </div>
        </div>
        <TimerBar
          currentTime={(currentStep?.duration || 0) - (timeLeft || 0)}
          totalTime={currentStep?.duration || 0}
          color={currentStep?.color || ""}
        />
        <div className="absolute top-0 right-0 m-2">
          <button
            onClick={() => {
              router.push("/play");
            }}
            className="text-4xl font-semibold hover:bg-gray-200"
          >
            <PlayArrowIcon />
          </button>
          <button
            onClick={() => {
              workoutState?.manager?.previousStep();
            }}
            className="text-4xl font-semibold hover:bg-gray-200"
          >
            <SkipPreviousIcon />
          </button>
          <button
            onClick={() => {
              workoutState?.manager?.nextStep();
            }}
            className="text-4xl font-semibold hover:bg-gray-200"
          >
            <SkipNextIcon />
          </button>
        </div>
      </div>
    </div>
  );
}
export default function WorkoutSelectionView() {
  const web5state = useSelector((state: RootState) => state.web5);
  const workoutState = useSelector((state: RootState) => state.workout);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [showInfo, setShowInfo] = useState(false); // State to control the modal visibility
  const [showModal, setShowModal] = useState(false); // State to control the modal visibility
  const router = useRouter();

  useEffect(() => {
    if (web5state.web5 && web5state.loaded) {
      setIsLoading(true);
      loadRoutines(web5state.web5, dispatch);
      setIsLoading(false);
    }
  }, [web5state]);

  useEffect(() => {
    if (workoutState) {
      showNotification(workoutState);
    }
  }, [workoutState]);

  // TODO: fix typing
  // @ts-ignore
  const showNotification = (workoutState: any) => {
    const name = workoutState?.manager?.workout?.routine?.name;
    if ("Notification" in window && Notification.permission === "granted") {
      const notificationOptions = {
        body: `Current Workout: ${name}`,
      };
      new Notification("Workout", notificationOptions);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center m-4">
        <button
          onClick={() => setShowModal(true)}
          className="h-10 w-10 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
        >
          <span>
            <AddCircleOutlineIcon />
          </span>
        </button>
        <div className="flex rounded-lg text-4xl text-white">
          <button
            onClick={() => router.push("/activity")}
            className="text-white "
          >
            <InsertChartIcon />
          </button>
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="text-4xl rounded-md flex items-center"
          >
            {showInfo ? (
              <span
                className=""
                role="img"
                aria-label="Close"
                style={{ color: "black" }}
              >
                <CloseIcon />
              </span>
            ) : (
              <span className="mr-2" role="img" aria-label="Settings">
                <SettingsIcon />
              </span>
            )}
          </button>
        </div>
      </div>
      {showInfo && <SettingInfo />}
      {workoutState.manager.started && <CurrentWorkoutCard />}
      <div className="routine-cards-container">
        {!isLoading ? (
          <div>
            {workoutState.routines.length > 0 ? (
              <CardGrid />
            ) : (
              <div className="p-4">
                No routines found. Please add a routine.{" "}
              </div>
            )}
          </div>
        ) : (
          <div>Loading...</div>
        )}
      </div>
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen">
            <div className="modal-overlay fixed inset-0 bg-black opacity-50"></div>
            <div className="modal-container w-full bg-white text-black fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  max-w-screen-md p-6 rounded-lg shadow-lg overflow-y-auto">
              <RoutineConfigurationForm
                onSubmitted={() => {
                  setShowModal(false);
                  loadRoutines(web5state.web5, dispatch);
                }}
              />
              <button
                onClick={() => setShowModal(false)}
                className="py-2  px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
