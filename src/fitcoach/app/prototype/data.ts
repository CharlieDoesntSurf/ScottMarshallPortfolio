export type Equipment =
  "Bodyweight" | "Dumbbells" | "Barbell" | "Cable" | "Machine";
export type Exercise = {
  id: string;
  name: string;
  muscle: string;
  equipment: string;
  kind: "strength" | "timed" | "cardio";
  cue: string;
  instructions?: string[];
  primaryMuscles?: string[];
  secondaryMuscles?: string[];
  image?: string;
  animation?: string;
  source?: string;
  sourceId?: string;
};
export type Routine = {
  id: string;
  name: string;
  subtitle: string;
  minutes: number;
  focus: string;
  exerciseIds: string[];
  color: string;
  targets?: {
    exerciseId: string;
    sets: number;
    reps: number;
    weightKg: number;
    seconds: number;
  }[];
};
export type Intake = {
  name: string;
  goal: string;
  experience: string;
  days: string[];
  minutes: number;
  equipment: Equipment[];
  limitations: string;
  motivation: string;
};
export const emptyIntake: Intake = {
  name: "",
  goal: "Build strength",
  experience: "Getting started",
  days: ["Mon", "Wed", "Fri"],
  minutes: 40,
  equipment: ["Bodyweight", "Dumbbells"],
  limitations: "",
  motivation: "",
};
export const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
export type LoggedSet = {
  exerciseId: string;
  position: number;
  reps: number;
  weightKg: number;
  seconds: number;
  done: boolean;
  rir?: number | null;
};
export type Session = {
  id: string;
  routineId: string;
  revision?: number;
  status?: "in_progress" | "completed" | "abandoned";
  name: string;
  startedAt: string;
  completedAt?: string;
  sets: LoggedSet[];
};
export function newSession(routine: Routine): Session {
  return {
    id: crypto.randomUUID(),
    routineId: routine.id,
    name: routine.name,
    startedAt: new Date().toISOString(),
    sets: routine.exerciseIds.flatMap((exerciseId) =>
      Array.from(
        {
          length:
            routine.targets?.find((t) => t.exerciseId === exerciseId)?.sets ??
            3,
        },
        (_, position) => ({
          exerciseId,
          position,
          reps:
            routine.targets?.find((t) => t.exerciseId === exerciseId)?.reps ??
            10,
          weightKg:
            routine.targets?.find((t) => t.exerciseId === exerciseId)
              ?.weightKg ?? 0,
          seconds:
            routine.targets?.find((t) => t.exerciseId === exerciseId)
              ?.seconds ?? 30,
          done: false,
        }),
      ),
    ),
  };
}
export const schemaGroups = [
  {
    name: "Your workouts",
    color: "purple",
    tables: [
      [
        "public.workouts / workout_exercises",
        "Manual and imported templates with per-exercise targets",
      ],
      [
        "public.completed_workouts / completed_workout_exercises / completed_sets",
        "In-progress and completed sessions; actual reps, kg, time and RIR",
      ],
    ],
  },
  {
    name: "Exercise library",
    color: "purple",
    tables: [
      [
        "public.exercises",
        "1,324 openGym movements with form instructions, muscles and media references",
      ],
      [
        "exercise_liss.*",
        "Existing normalized catalog replaced with the same openGym dataset",
      ],
      ["public.opengym_exercise_translations", "13 instruction languages"],
    ],
  },
  {
    name: "Sources & guides",
    color: "purple",
    tables: [
      [
        "public.opengym_resources",
        "811 preserved datasets, guides, translations and source files",
      ],
      [
        "public.opengym_starter_plans / opengym_catalog_imports",
        "Four source plans, revision hashes and import provenance",
      ],
      [
        "Storage: fittrack-opengym-assets",
        "Private images, GIF demos and complete source archive",
      ],
    ],
  },
  {
    name: "Your context",
    color: "purple",
    tables: [
      [
        "public.fittrack_interviews",
        "Optional interview, saved to this development workspace",
      ],
      [
        "public.fittrack_workout_revisions / fittrack_mutations",
        "Workout edit history and safe retry receipts",
      ],
      [
        "public.fittrack_workspace_settings",
        "Existing profile used for localhost; account sign-in deferred",
      ],
    ],
  },
];
