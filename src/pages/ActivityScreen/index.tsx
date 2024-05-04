import WorkoutChart from "@/components/workout/WorkoutChart";
import HomeButton from "@/components/buttons/navigation/HomeButton";
import { useRouter } from "next/router";

export default function ActivityPage() {
  const router = useRouter();

  return (
    <div>
      <div className="absolute top-0 right-0 p-2 text-4xl rounded">
        <HomeButton />
      </div>
      <div className="flex justify-center items-center">
        This page is not yet active yet. We are working on it!
        <br />
        Workout History
        <div className="workout-chart-container max-h-56 w-1/2">
          <WorkoutChart />
        </div>
      </div>
    </div>
  );
}
