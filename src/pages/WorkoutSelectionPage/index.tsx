"use client";

import { useSelector, useDispatch, Dispatch } from "react-redux";
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

const loadRoutines = async (web5: Web5, dispatch: Dispatch) => {
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

export default function WorkoutSelectionView() {
  const web5state = useSelector((state: RootState) => state.web5);
  const workoutState = useSelector((state: RootState) => state.workout);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [showInfo, setShowInfo] = useState(false); // State to control the modal visibility
  const [showModal, setShowModal] = useState(false); // State to control the modal visibility

  useEffect(() => {
    if (web5state.web5 && web5state.loaded) {
      setIsLoading(true);
      loadRoutines(web5state.web5, dispatch);
      setIsLoading(false);
    }
  }, [web5state]);

  useEffect(() => {}, [workoutState]);

  return (
    <div>
      <div className="flex justify-between items-center m-4">
        <button
          onClick={() => setShowModal(true)}
          className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center"
        >
          <span>Add Workout</span>
        </button>
        <div className="rounded-lg">
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="text-4xl text-white py-2 px-4 rounded-md flex items-center"
          >
            {showInfo ? (
              <span
                className=""
                role="img"
                aria-label="Close"
                style={{ color: "black" }}
              >
                ❌
              </span>
            ) : (
              <span className="mr-2" role="img" aria-label="Settings">
                ⚙️
              </span>
            )}
          </button>
        </div>
      </div>
      {showInfo && <SettingInfo />}
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
