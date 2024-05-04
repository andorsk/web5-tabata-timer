import WorkoutChart from "@/components/workout/WorkoutChart";
import HomeButton from "@/components/buttons/navigation/HomeButton";
import { useRouter } from "next/router";
import { getSessions } from "@/lib/store/dwn/session";
import { WorkoutSession } from "@/models/workout";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/reducers";

type SessionCardProps = {
  session: WorkoutSession;
  index: number;
};

function SessionCard({ session, index }: SessionCardProps) {
  const startTime = session.startTime ? new Date(session.startTime) : null;
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
    <div className="border border-gray-200 p-4 rounded-md">
      <div>
        <span className="font-bold">Session ID: </span> {session?.id}
      </div>
      <div>
        <span className="font-bold">Workout Name:</span>{" "}
        {session?.routine?.name}
      </div>
      <div>
        <span className="font-bold">Workout ID:</span> {session?.routine?.id}
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
        {session?.totalTime}
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
      throw new Error("can't load routines. web5 not loaded");
    }
    const sessions = await getSessions(web5);
    const data: WorkoutSession[] = await Promise.all(
      (sessions?.records || []).map(async (v) => {
        const vv = await v.data.json();
        return { ...vv, id: v.id } as WorkoutSession;
      }),
    );
    setSessions(data);
  };

  return (
    <div>
      <div className="absolute top-0 right-0 p-2 text-4xl rounded">
        <HomeButton />
      </div>
      <div className="flex justify-center items-center">
        This page is not yet active yet. We are working on it!
        <br />
        Workout History
      </div>
      <div className="space-y-4">
        {sessions.map((session, index) => (
          <div key={index} className="border border-gray-200 p-4 rounded-md">
            <SessionCard session={session} index={index} />
          </div>
        ))}
      </div>
    </div>
  );
}
