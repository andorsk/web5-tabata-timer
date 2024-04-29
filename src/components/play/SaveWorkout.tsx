import React, { useState, useEffect } from "react";
import "./SaveWorkout.css";

// @ts-ignore
const SaveWorkoutModal = ({ isOpen, onClose, onSave }) => {
  const [workoutName, setWorkoutName] = useState("");

  const handleSave = () => {
    onSave(workoutName);
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, [isOpen]);

  return (
    <div className={`modal ${isOpen ? "block" : "hidden"}`}>
      <div className="modal-overlay absolute w-full h-full bg-gray-900 "></div>
      <div className="modal-container bg-white w-96 mx-auto mt-24 p-6 rounded-lg shadow-lg">
        <div className="modal-content">
          <h1 className="text-lg font-semibold mb-4">Save Workout</h1>
          <input
            type="text"
            value={workoutName}
            onChange={(e) => setWorkoutName(e.target.value)}
            placeholder="Workout Name"
            className="w-full p-2 border rounded-lg mb-4"
          />
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
            >
              Save
            </button>
            <button
              onClick={onClose}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaveWorkoutModal;
