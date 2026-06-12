export interface WorkoutPlanExercise {
  id?: number;
  exerciseId: number;
  exerciseName?: string;
  sets: number;
  repetitions: number;
}

export interface WorkoutPlan {
  id?: number;
  title: string;
  memberId: number;
  memberName?: string;
  exercises: WorkoutPlanExercise[];
}