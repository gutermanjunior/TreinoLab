// Tipos principais do app Registro de Força

export interface Exercise {
  id: string
  name: string
  muscleGroup: MuscleGroup
  equipment: Equipment
  instructions: string[]
}

export type MuscleGroup = 
  | 'peito'
  | 'costas'
  | 'ombros'
  | 'biceps'
  | 'triceps'
  | 'pernas'
  | 'gluteos'
  | 'abdomen'
  | 'antebracos'
  | 'cardio'

export type Equipment = 
  | 'barra'
  | 'halteres'
  | 'maquina'
  | 'cabo'
  | 'peso-corporal'
  | 'kettlebell'
  | 'elastico'
  | 'outro'

export interface WorkoutSet {
  id: string
  weight: number
  reps: number
  completed: boolean
  isPersonalRecord?: boolean
}

export interface WorkoutExercise {
  id: string
  exerciseId: string
  sets: WorkoutSet[]
  restTime: number // segundos
  notes?: string
}

export interface Workout {
  id: string
  name: string
  date: string // ISO string
  startTime?: string // ISO string
  endTime?: string // ISO string
  exercises: WorkoutExercise[]
  duration: number // minutos
  completed: boolean
  routineId?: string
}

export interface Routine {
  id: string
  name: string
  description?: string
  exercises: RoutineExercise[]
  createdAt: string
  updatedAt: string
}

export interface RoutineExercise {
  exerciseId: string
  sets: number
  restTime: number // segundos
}

export interface PersonalRecord {
  id: string
  exerciseId: string
  weight: number
  reps: number
  date: string
  workoutId: string
}

export interface WeekStats {
  totalWorkouts: number
  totalVolume: number // kg
  totalSets: number
  totalTime: number // minutos
}

export interface Settings {
  defaultRestTime: number // segundos
  weightUnit: 'kg' | 'lb'
  soundEnabled: boolean
  vibrationEnabled: boolean
}

// Constantes para exibição
export const MUSCLE_GROUP_LABELS: Record<MuscleGroup, string> = {
  peito: 'Peito',
  costas: 'Costas',
  ombros: 'Ombros',
  biceps: 'Bíceps',
  triceps: 'Tríceps',
  pernas: 'Pernas',
  gluteos: 'Glúteos',
  abdomen: 'Abdômen',
  antebracos: 'Antebraços',
  cardio: 'Cardio',
}

export const EQUIPMENT_LABELS: Record<Equipment, string> = {
  barra: 'Barra',
  halteres: 'Halteres',
  maquina: 'Máquina',
  cabo: 'Cabo',
  'peso-corporal': 'Peso Corporal',
  kettlebell: 'Kettlebell',
  elastico: 'Elástico',
  outro: 'Outro',
}
