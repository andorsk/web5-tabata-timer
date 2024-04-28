import Image from "next/image";
import WorkoutSelectionView from "./workoutselectionview/page";
// import PlayView from "./playview/page";
import { RoutineProvider } from "@/context/RoutineContext"; // Adjust the import path as necessary

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col ">
      <div className="z-10 w-full items-center justify-between font-mono text-sm lg:flex bg-green-500">
        <WorkoutSelectionView />
      </div>
    </main>
  );
}
