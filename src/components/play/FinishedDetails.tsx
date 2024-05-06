import { WorkoutState } from "@/lib/reducers/workout";

type FinishedDetailsProps = {
  workoutState: WorkoutState;
};

function FinishedDetails({ workoutState }: FinishedDetailsProps) {
  const startTime = workoutState?.manager?.workout?.startTime
    ? new Date(workoutState?.manager?.workout?.startTime)
    : null;
  const endTime = workoutState?.manager?.workout?.endTime
    ? new Date(workoutState?.manager?.workout?.endTime)
    : null;
  let computedDuration = "";
  if (startTime && endTime) {
    const durationMs = endTime.getTime() - startTime.getTime();
    const milliseconds = durationMs % 1000;
    const seconds = Math.floor((durationMs / 1000) % 60);
    const minutes = Math.floor((durationMs / (1000 * 60)) % 60);
    const hours = Math.floor((durationMs / (1000 * 60 * 60)) % 24);

    // Format the result as HH:MM:SS:mm
    const formattedDuration = `${hours
      .toString()
      .padStart(2, "0")} hours ${minutes
      .toString()
      .padStart(2, "0")} minutes ${seconds
      .toString()
      .padStart(2, "0")} seconds ${milliseconds
      .toString()
      .padStart(3, "0")} milliseconds`;

    computedDuration = formattedDuration;
  }

  return (
    <div className="text-left space-y-2">
      <div>
        <span className="font-bold">Session ID: </span>{" "}
        {workoutState?.manager?.workout?.id?.slice(-6)}
      </div>
      <div>
        <span className="font-bold">Workout Name:</span>{" "}
        {workoutState?.manager?.workout?.routine?.name}
      </div>
      <div>
        <span className="font-bold">Routine ID:</span>{" "}
        {workoutState?.manager?.workout?.routine?.id?.slice(-6)}
      </div>
      <div>
        <span className="font-bold">Start Time:</span>{" "}
        {workoutState?.manager?.workout?.startTime}
      </div>
      <div>
        <span className="font-bold">End Time:</span>{" "}
        {workoutState?.manager?.workout?.endTime}
      </div>
      <div>
        <span className="font-bold">Time Required to Complete:</span> <br />
        {computedDuration}
      </div>
      <div>
        <span className="font-bold">Workout Duration:</span>{" "}
        {workoutState?.manager?.totalTime}
      </div>
      <div>
        <span className="font-bold">Number of Steps:</span>{" "}
        {workoutState?.manager?.workout?.steps?.length}
      </div>
      <div>
        <span className="font-bold">Completed:</span>{" "}
        {workoutState?.manager?.workout?.completed ? "Yes" : "No"}
      </div>
    </div>
  );
}

export default FinishedDetails;
