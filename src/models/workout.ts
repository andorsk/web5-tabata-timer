export type Routine = {
  name: string;
  title: string;
  description?: string;
  lastUpdated: string;
  createdOn: string;
  createdBy: string;
  id: string;
  routine: RoutineConfiguration;
};

export type TimedIntervalConfiguration = {
  duration: number; // duration in seconds
  name: string;
  value: number;
};

export type SetConfiguration = {
  value: number;
  name: string;
};

export type RoutineConfiguration = {
  Prepare: TimedIntervalConfiguration;
  Work: TimedIntervalConfiguration;
  Rest: TimedIntervalConfiguration;
  Cycles: SetConfiguration;
  Sets: SetConfiguration;
  RestBetweenSteps: TimedIntervalConfiguration;
  CoolDown: TimedIntervalConfiguration;
};

export type Session = {
  startTime: string;
  endTime: string;
  notes: string[];
  routineId: string;
  routine: Routine;
  completed: boolean;
};

export const validateRoutineConfiguration = (routine: RoutineConfiguration) : boolean {
  if ((routine.Prepare.duration < 0) || (routine.Work.duration < 0) || (routine.Rest.duration < 0) || (routine.Cycles.value < 1) || (routine.Sets.value < 1)  || (routine.RestBetweenSteps.duration < 0) || (routine.CoolDown.duration < 0)){
    return false
  } return true

}
