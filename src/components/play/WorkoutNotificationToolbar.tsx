import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { formatDuration } from "@/lib/time";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/reducers";
import { TimerBar } from "@/components/timer";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";

function WorkoutNotificationToolbar() {
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

  const requestNotificationPermission = () => {
    if ("Notification" in window) {
      Notification.requestPermission((result) => {
        if (result === "granted") {
          console.log("Acess granted! :)");
          showServerTimeNotification();
        } else if (result === "denied") {
          console.log("Access denied :(");
        } else {
          console.log("Request ignored :/");
        }
      });
    }
  };

  function showServerTimeNotification() {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        console.log("sending notification");
        setInterval(() => {
          registration.showNotification("Server time", {
            body: "Exercise",
          });
          console.log("done showing notification");
        }, 30000);
      });
    }
  }

  // requestNotificationPermission();

  useEffect(() => {
    console.log("showing notification");
    //showNotification("Web Tabata Timer Workout ", "<div>adsf</div>");
  }, [workoutState, workoutState.manager.timer]);

  return (
    <div
      onClick={() => {
        router.push("/play");
      }}
    >
      <div
        className={`shadow-lg bg-white rounded-lg p-4 m-4 relative hover:bg-gray-100`}
      >
        <div className="mainStep">
          {!workoutState?.manager?.workout?.completed ? (
            <button
              className={`${currentStep?.color} text-white rounded-md py-1 px-2 text-sm`}
            >
              {currentStep?.name}
            </button>
          ) : (
            <>
              <button className="text-white bg-blue-500 rounded-md py-1 px-2 text-sm">
                Finished!
              </button>
            </>
          )}
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
            {workoutState?.manager?.timer?.isPlaying ? (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    workoutState?.manager?.toggleWorkout();
                  }}
                  className="text-4xl font-semibold hover:bg-gray-200"
                >
                  <PauseIcon />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    workoutState?.manager?.toggleWorkout();
                  }}
                  className="text-4xl font-semibold hover:bg-gray-200"
                >
                  <PlayArrowIcon />
                </button>
              </>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                workoutState?.manager?.previousStep();
              }}
              className="text-4xl font-semibold hover:bg-gray-200"
            >
              <SkipPreviousIcon />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                workoutState?.manager?.nextStep();
              }}
              className="text-4xl font-semibold hover:bg-gray-200"
            >
              <SkipNextIcon />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WorkoutNotificationToolbar;
