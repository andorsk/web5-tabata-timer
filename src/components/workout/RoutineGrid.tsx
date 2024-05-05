import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { RootState } from "@/lib/reducers";
import { Routine, WorkoutSession } from "@/models/workout";
import { useSelector, useDispatch } from "react-redux";
import RoutineCard from "@/components/RoutineCard";
import { storeSession } from "@/lib/store/dwn/session";
import RoutineConfigurationForm from "@/components/configureRoutine/RoutineConfigurationForm";
import { setRoutines } from "@/lib/actions/workout";
import { WorkoutState } from "@/lib/reducers/workout";
import { Web5 } from "@web5/api";

import {
  updateRoutine,
  getRoutines,
  deleteRoutine,
  storeRoutine,
} from "@/lib/store/dwn/routines";

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

function RoutineGrid() {
  const workoutState = useSelector((state: RootState) => state.workout);
  const dispatch = useDispatch();
  const web5state = useSelector((state: RootState) => state.web5);
  const [isLoading, setIsLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedRoutine, setSelectedRoutine] = useState<Routine | null>(null);

  const [chosenId, setChosenId] = useState("");
  const router = useRouter();

  useEffect(() => {
    workoutState.manager.setDispatcher(dispatch);
    if (web5state.web5) {
      workoutState.manager.setWeb5(web5state.web5);
    }
  }, []);

  const createWorkout = async (r: Routine) => {
    const h = async (r: Routine) => {
      setIsLoading(true);
      await workoutState.manager.setWorkout({ routine: r });
      await workoutState.manager?.startWorkout();
      setIsLoading(false);
    };
    await h(r);
  };

  const enterPlayMode = () => {
    router.push("/play");
  };

  const handleSelect = async (r: Routine) => {
    if (!r) {
      throw new Error("no routine specified");
    }
    // get current routine
    const curRoutineId = workoutState.manager?.workout?.routine?.id;
    setChosenId(r.id || "");
    if (r.id === curRoutineId) {
      // GO TO EXISTING ROUTINE
      enterPlayMode();
    } else {
      await createWorkout(r);
      enterPlayMode();
    }
    setChosenId("");
  };

  const deleteRoutineHandler = (r: Routine) => {
    if (web5state.web5 && web5state.loaded) {
      deleteRoutine(r?.id || "", web5state.web5).then(() => {
        setIsLoading(true);
        loadRoutines(web5state.web5, dispatch);
        setIsLoading(false);
      });
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
      {workoutState.routines.map((routine) => (
        <RoutineCard
          key={routine.id}
          routine={routine}
          onSelect={(r: Routine) => {
            handleSelect(r);
          }}
          onDelete={deleteRoutineHandler}
          onEdit={() => {
            setSelectedRoutine(routine);
            setShowEditModal(true);
          }}
          children={
            isLoading &&
            chosenId === routine.id && <div className="p-4">Loading</div>
          }
        />
      ))}
      {showEditModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen">
            <div className="modal-overlay fixed inset-0 bg-black opacity-50"></div>
            <div className="modal-container w-3/4 bg-white text-black fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  max-w-screen-md p-6 rounded-lg shadow-lg overflow-y-auto">
              <RoutineConfigurationForm
                title="Edit Routine"
                onSubmit={(r: Routine) => {
                  const handle = async (r: Routine) => {
                    try {
                      if (!web5state.web5) {
                        throw new Error("web5 not ready");
                      }
                      await updateRoutine(r, web5state.web5);
                      setShowEditModal(false);
                      loadRoutines(web5state.web5, dispatch);
                    } catch (e) {
                      console.error(e);
                    }
                  };
                  handle(r);
                }}
                onClose={() => {
                  setShowEditModal(false);
                }}
                defaultValues={selectedRoutine || undefined}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RoutineGrid;
