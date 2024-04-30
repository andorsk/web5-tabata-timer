// pages/workouts.tsx
"use client";
import RoutineCard from "@/components/RoutineCard"; // Make sure the path is correct
import { Routine } from "@/models/workout";
import { storeRoutine, getRoutines } from "@/lib/store/dwn/routines";
import { useWeb5 } from "@/context/Web5Context";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Web5 } from "@web5/api";

import RoutineConfigurationForm from "@/components/configureRoutine/ConfigureRoutine";

export default function WorkoutSelectionView() {
  const { web5, did } = useWeb5();
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [showModal, setShowModal] = useState(false); // State to control the modal visibility
  const router = useRouter();

  const handleAddWorkout = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleGetRoutines = async (web5: Web5) => {
    try {
      const r = await getRoutines(web5);
      const routinesData = await Promise.all(
        // @ts-ignore
        r?.records?.map(async (v, _) => {
          const vv = await v.data.json();
          vv.id = v.id;
          return vv; // Return vv to include it in the array of routinesData
        }),
      );
      // @ts-ignore
      setRoutines(routinesData); // Update state with the fetched routinesData
      console.log(routinesData);
    } catch (error) {
      console.error("Error fetching routines:", error);
    }
  };

  useEffect(() => {
    if (web5) {
      console.log("GOT Dispatched Event");
      const handleFormSubmitted = async () => {
        setShowModal(false);
        console.log("testing dispatch");
        await handleGetRoutines(web5);
        console.log("passed dispatch");
      };
      document.addEventListener("routineSubmitted", handleFormSubmitted);
      return () => {
        document.removeEventListener("routineSubmitted", handleFormSubmitted);
      };
    }
  }, [router, web5]);

  useEffect(() => {
    if (web5) {
      handleGetRoutines(web5);
    }
  }, [web5]);

  return (
    <div className="p-4">
      DID: {did}
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Web5 Workouts</h1>
      <button
        className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        onClick={handleAddWorkout}
      >
        {" "}
        Add Workout{" "}
      </button>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
        {routines.map((routine) => (
          <RoutineCard key={routine.id} routine={routine} />
        ))}
      </div>
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen">
            <div className="modal-overlay fixed inset-0 bg-black opacity-50"></div>
            <div className="modal-container bg-red-500  w-full fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white max-w-screen-md p-6 rounded-lg shadow-lg overflow-y-auto">
              <RoutineConfigurationForm />
              <button
                onClick={handleCloseModal}
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
