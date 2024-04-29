import Image from "next/image";
import WorkoutSelectionView from "@/app/workoutselectionview";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col ">
      <div className="z-10 w-full items-center justify-between font-mono text-sm  bg-green-500">
        <WorkoutSelectionView />
      </div>
    </main>
  );
}
