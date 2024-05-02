import WorkoutSelectionView from "@/app/workoutselectionview";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col  bg-green-500">
      <div className="z-10 w-full items-center justify-between font-mono text-sm  ">
        <WorkoutSelectionView />
      </div>
    </main>
  );
}
