"use client";

import { useSelector, useDispatch } from "react-redux";
import React, { useState, useEffect } from "react";
import { Web5 } from "@web5/api";
import { RootState } from "@/lib/reducers";
import { setRoutines } from "@/lib/actions/workout";
import {
  updateRoutine,
  getRoutines,
  deleteRoutine,
  storeRoutine,
} from "@/lib/store/dwn/routines";
import { storeSession } from "@/lib/store/dwn/session";

import { Routine, WorkoutSession } from "@/models/workout";
import RoutineCard from "@/components/RoutineCard";
import SettingInfo from "@/components/SettingInfo";
import RoutineConfigurationForm from "@/components/configureRoutine/RoutineConfigurationForm";
import { useRouter } from "next/router";
import { setWorkout } from "@/lib/actions/workout";
import SettingsIcon from "@mui/icons-material/Settings";
import CloseIcon from "@mui/icons-material/Close";
import { formatDuration } from "@/lib/time";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import { TimerBar } from "@/components/timer";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import InsertChartIcon from "@mui/icons-material/InsertChart";
import { WorkoutState } from "@/lib/reducers/workout";
import WorkoutNotificationToolbar from "@/components/play/WorkoutNotificationToolbar";
import RoutineGrid from "@/components/workout/RoutineGrid";

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
  const msg = setRoutines(data);
  dispatch(setRoutines(data));
};

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
            className="text-white"
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
      {workoutState.manager.started && <WorkoutNotificationToolbar />}

      <div className="routine-cards-container">
        {!isLoading ? (
          <div>
            {workoutState.routines.length > 0 ? (
              <RoutineGrid />
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
            <div className="modal-container w-3/4 bg-white text-black fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  max-w-screen-md p-6 rounded-lg shadow-lg overflow-y-auto">
              <RoutineConfigurationForm
                title="Create Routine"
                onSubmit={(r: Routine) => {
                  const handle = async (r: Routine) => {
                    try {
                      if (!web5state.web5) {
                        throw new Error("web5 not ready");
                      }
                      await storeRoutine(r, web5state.web5);
                      setShowModal(false);
                      loadRoutines(web5state.web5, dispatch);
                    } catch (e) {
                      console.error(e);
                    }
                  };
                  handle(r);
                }}
                onClose={() => {
                  setShowModal(false);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
