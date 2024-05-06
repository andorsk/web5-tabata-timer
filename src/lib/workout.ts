import { RoutineConfiguration, Routine, Step } from "@/models/workout";

export const createSteps = (config: RoutineConfiguration): Step[] => {
  const steps = [
    {
      name: config.Prepare.name,
      duration: config.Prepare.duration,
      color: "bg-yellow-500",
      cycle: 0,
      set: 0,
      totalCycles: config.Cycles.value,
    } as Step,
  ];

  for (let j = 0; j < config.Sets.value; j++) {
    for (let i = 0; i < config.Cycles.value; i++) {
      steps.push({
        name: config.Work.name,
        duration: config.Work.duration,
        color: "bg-red-500",
        cycle: i,
        set: j,
        totalSets: config.Sets.value,
        totalCycles: config.Cycles.value,
      });
      if (j <= config.Cycles.value - 1 && i <= config.Sets.value) {
        steps.push({
          name: config.Rest.name,
          duration: config.Rest.duration,
          color: "bg-green-500",
          cycle: i,
          set: j,
          totalSets: config.Sets.value,
          totalCycles: config.Cycles.value,
        });
      }
    }
    if (j < config.Sets.value - 1) {
      steps.push({
        name: config.RestBetweenSteps.name,
        duration: config.RestBetweenSteps.duration,
        color: "bg-teal-500",
        cycle: 0,
        totalSets: config.Sets.value,
        totalCycles: config.Cycles.value,
        set: j,
      });
    }
  }

  steps.push({
    name: config.CoolDown.name,
    duration: config.CoolDown.duration,
    color: "bg-teal-500",
    cycle: 0,
    totalSets: 1,
    totalCycles: config.Cycles.value,
    set: 0,
  });

  steps.push({
    name: "Finish",
    duration: 0,
    color: "bg-blue-500",
    cycle: 0,
    totalSets: 0,
    totalCycles: 0,
    set: 0,
  });

  return steps;
};

export const computeTotalTimeFromSteps = (steps: Step[]): number => {
  const totalTime = steps.reduce((total, step) => {
    return total + step.duration;
  }, 0);
  return totalTime;
};
