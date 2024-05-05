import WorkoutChart from "@/components/workout/WorkoutChart";
import HomeButton from "@/components/buttons/navigation/HomeButton";

import { useRouter } from "next/router";
import { getSessions, deleteSession } from "@/lib/store/dwn/session";
import { WorkoutSession, Step } from "@/models/workout";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/reducers";
import "./segment.css";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ShareIcon from "@mui/icons-material/Share";

type SessionCardProps = {
  session: WorkoutSession;
  index: number;
  onSelect?: (session: WorkoutSession) => void; // Optional onSelect callback function
  onDelete?: (session: WorkoutSession) => void;
  onEdit?: (session: WorkoutSession) => void;
  onShare?: (session: WorkoutSession) => void;
};

type StepBarProps = {
  steps: Step[];
};
const ProgressBar: React.FC<StepBarProps> = ({ steps }) => {
  const totalDuration = steps.reduce((acc, step) => acc + step.duration, 0);
  return (
    <div className="progress-bar bg-gray-100">
      {steps.map((step, index) => (
        <div
          key={index}
          className={`segment ${step.color}`}
          style={{
            width: `${(step.duration / totalDuration) * 100}%`,
          }}
        ></div>
      ))}
    </div>
  );
};

function SessionCard({
  session,
  index,
  onEdit,
  onDelete,
  onSelect,
  onShare,
}: SessionCardProps) {
  const startTime = session.startTime ? new Date(session.startTime) : null;
  const web5state = useSelector((state: RootState) => state.web5);
  const endTime = session.endTime ? new Date(session.endTime) : null;
  let formattedDuration = "";

  if (startTime && endTime) {
    const durationMs = endTime.getTime() - startTime.getTime();
    const milliseconds = durationMs % 1000;
    const seconds = Math.floor((durationMs / 1000) % 60);
    const minutes = Math.floor((durationMs / (1000 * 60)) % 60);
    const hours = Math.floor((durationMs / (1000 * 60 * 60)) % 24);

    // Format the result as HH:MM:SS:mm
    formattedDuration = `${hours.toString().padStart(2, "0")} hours ${minutes
      .toString()
      .padStart(2, "0")} minutes ${seconds
      .toString()
      .padStart(2, "0")} seconds ${milliseconds
      .toString()
      .padStart(3, "0")} milliseconds`;
  }

  return (
    <div className="bg-white shadow-lg rounded-lg p-4 m-4 relative hover:bg-gray-100">
      <div className="absolute top-4 right-4 flex space-x-2">
        <div>
          <button
            onClick={() => {
              if (onEdit && session) {
                onEdit(session);
              }
            }}
          >
            <EditIcon />
          </button>
          <button
            onClick={() => {
              if (onDelete && session) {
                onDelete(session);
              }
            }}
          >
            <DeleteIcon />
          </button>
          <button
            onClick={() => {
              if (onShare && session) {
                onShare(session);
              }
            }}
          >
            <ShareIcon />
          </button>
        </div>
      </div>
      <div>
        <div>
          <span className="font-bold">Session ID: </span>{" "}
          {session?.id?.slice(-6)}
        </div>
        <div>
          <span className="font-bold">Workout Name:</span>{" "}
          {session?.routine?.name}
        </div>
        <div>
          <span className="font-bold">Start Time:</span> {session?.startTime}
        </div>
        <div>
          <span className="font-bold">End Time:</span> {session?.endTime}
        </div>
        <div>
          <span className="font-bold">Time Required to Complete:</span>{" "}
          {formattedDuration}
        </div>
        <div>
          <span className="font-bold">Workout Duration:</span>{" "}
          {session?.totalTime / 1000} seconds
        </div>
        <div>
          <span className="font-bold">Number of Steps:</span>{" "}
          {session?.steps?.length}
        </div>
        <div>
          <span className="font-bold">Completed:</span>{" "}
          {session?.completed ? "Yes" : "No"}
        </div>
      </div>
      <div className="">
        {session.steps && <ProgressBar steps={session.steps} />}
      </div>
    </div>
  );
}

export default function ActivityPage() {
  const router = useRouter();
  const web5state = useSelector((state: RootState) => state.web5);
  const [isLoading, setIsLoading] = useState(false);

  const [sessions, setSessions] = useState<WorkoutSession[]>([]);

  useEffect(() => {
    if (web5state.web5 && web5state.loaded) {
      setIsLoading(true);
      loadSessions(web5state.web5);
      setIsLoading(false);
    }
  }, [web5state]);

  // @ts-ignore
  const loadSessions = async (web5?: Web5 | null) => {
    if (!web5) {
      throw new Error("can't load sessions. web5 not loaded");
    }
    const sessions = await getSessions(web5);
    const data: WorkoutSession[] = await Promise.all(
      (sessions?.records || []).map(async (v) => {
        const vv = await v.data.json();
        return { ...vv, id: v.id } as WorkoutSession;
      }),
    );
    console.log("setting new sessions");
    setSessions(data);
  };

  return (
    <div>
      <div className="absolute top-0 left-4 p-2 text-4xl rounded">
        <HomeButton />
      </div>
      <div className="flex justify-center items-center">
        <br />
        Workout History
      </div>
      <div className="space-y-4">
        {sessions.map((session, index) => (
          <div key={index} className=" rounded-md">
            <SessionCard
              session={session}
              index={index}
              onSelect={(w: WorkoutSession) => {
                alert("not supported yet");
              }}
              onEdit={(w: WorkoutSession) => {
                alert("not supported yet");
              }}
              onDelete={async (w: WorkoutSession) => {
                try {
                  if (web5state.web5 && w.id) {
                    await deleteSession(w.id, web5state.web5);
                    await loadSessions(web5state.web5);
                  }
                } catch (e) {
                  alert(e);
                }
              }}
              onShare={(w: WorkoutSession) => {
                alert("not supported yet");
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
