import { Workout, Routine, PersonalRecord, Settings, WorkoutSet } from './types'
import { getExerciseById } from './exercises-data'

// Keys do localStorage
const STORAGE_KEYS = {
  WORKOUTS: 'treinolab-workouts',
  ROUTINES: 'treinolab-routines',
  PERSONAL_RECORDS: 'treinolab-prs',
  CURRENT_WORKOUT: 'treinolab-current',
  SETTINGS: 'treinolab-settings',
} as const

// Funções de Settings
export function getSettings(): Settings {
  if (typeof window === 'undefined') return getDefaultSettings()
  
  const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS)
  if (!stored) return getDefaultSettings()
  
  return JSON.parse(stored)
}

export function saveSettings(settings: Settings): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings))
}

function getDefaultSettings(): Settings {
  return {
    defaultRestTime: 90,
    weightUnit: 'kg',
    soundEnabled: true,
    vibrationEnabled: true,
  }
}

// Funções de Workouts
export function getWorkouts(): Workout[] {
  if (typeof window === 'undefined') return []
  
  const stored = localStorage.getItem(STORAGE_KEYS.WORKOUTS)
  if (!stored) return []
  
  return JSON.parse(stored)
}

export function saveWorkout(workout: Workout): void {
  if (typeof window === 'undefined') return
  
  const workouts = getWorkouts()
  const existingIndex = workouts.findIndex(w => w.id === workout.id)
  
  if (existingIndex >= 0) {
    workouts[existingIndex] = workout
  } else {
    workouts.unshift(workout)
  }
  
  localStorage.setItem(STORAGE_KEYS.WORKOUTS, JSON.stringify(workouts))
}

export function importWorkouts(newWorkouts: Workout[]): void {
  if (typeof window === 'undefined') return
  
  const workouts = getWorkouts()
  // Append new ones, maybe sort them all
  const combined = [...workouts, ...newWorkouts]
  
  // Deduplicate by ID just in case
  const uniqueWorkouts = Array.from(new Map(combined.map(w => [w.id, w])).values())
  uniqueWorkouts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  
  localStorage.setItem(STORAGE_KEYS.WORKOUTS, JSON.stringify(uniqueWorkouts))
}

export function deleteWorkout(workoutId: string): void {
  if (typeof window === 'undefined') return
  
  const workouts = getWorkouts().filter(w => w.id !== workoutId)
  localStorage.setItem(STORAGE_KEYS.WORKOUTS, JSON.stringify(workouts))
}

export function getWorkoutById(id: string): Workout | undefined {
  return getWorkouts().find(w => w.id === id)
}

// Funções de Current Workout (treino em andamento)
export function getCurrentWorkout(): Workout | null {
  if (typeof window === 'undefined') return null
  
  const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_WORKOUT)
  if (!stored) return null
  
  return JSON.parse(stored)
}

export function saveCurrentWorkout(workout: Workout | null): void {
  if (typeof window === 'undefined') return
  
  if (workout === null) {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_WORKOUT)
  } else {
    localStorage.setItem(STORAGE_KEYS.CURRENT_WORKOUT, JSON.stringify(workout))
  }
}

export function clearCurrentWorkout(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(STORAGE_KEYS.CURRENT_WORKOUT)
}

// Funções de Routines
export function getRoutines(): Routine[] {
  if (typeof window === 'undefined') return []
  
  const stored = localStorage.getItem(STORAGE_KEYS.ROUTINES)
  if (!stored) return []
  
  return JSON.parse(stored)
}

export function saveRoutine(routine: Routine): void {
  if (typeof window === 'undefined') return
  
  const routines = getRoutines()
  const existingIndex = routines.findIndex(r => r.id === routine.id)
  
  if (existingIndex >= 0) {
    routines[existingIndex] = routine
  } else {
    routines.push(routine)
  }
  
  localStorage.setItem(STORAGE_KEYS.ROUTINES, JSON.stringify(routines))
}

export function deleteRoutine(routineId: string): void {
  if (typeof window === 'undefined') return
  
  const routines = getRoutines().filter(r => r.id !== routineId)
  localStorage.setItem(STORAGE_KEYS.ROUTINES, JSON.stringify(routines))
}

export function getRoutineById(id: string): Routine | undefined {
  return getRoutines().find(r => r.id === id)
}

// Funções de Personal Records
export function getPersonalRecords(): PersonalRecord[] {
  if (typeof window === 'undefined') return []
  
  const stored = localStorage.getItem(STORAGE_KEYS.PERSONAL_RECORDS)
  if (!stored) return []
  
  return JSON.parse(stored)
}

export function savePersonalRecord(pr: PersonalRecord): void {
  if (typeof window === 'undefined') return
  
  const prs = getPersonalRecords()
  prs.push(pr)
  
  localStorage.setItem(STORAGE_KEYS.PERSONAL_RECORDS, JSON.stringify(prs))
}

export function getPersonalRecordForExercise(exerciseId: string): PersonalRecord | undefined {
  const prs = getPersonalRecords()
  return prs
    .filter(pr => pr.exerciseId === exerciseId)
    .sort((a, b) => b.weight - a.weight)[0]
}

export function checkAndUpdatePR(
  exerciseId: string, 
  set: WorkoutSet, 
  workoutId: string
): boolean {
  if (!set.completed || set.weight === 0) return false
  
  const currentPR = getPersonalRecordForExercise(exerciseId)
  
  // Verifica se é um novo PR (maior peso ou mesmo peso com mais reps)
  const isNewPR = !currentPR || 
    set.weight > currentPR.weight || 
    (set.weight === currentPR.weight && set.reps > currentPR.reps)
  
  if (isNewPR) {
    const newPR: PersonalRecord = {
      id: generateId(),
      exerciseId,
      weight: set.weight,
      reps: set.reps,
      date: new Date().toISOString(),
      workoutId,
    }
    savePersonalRecord(newPR)
    return true
  }
  
  return false
}

// Funções de estatísticas
export function getWeekWorkouts(): Workout[] {
  const workouts = getWorkouts()
  const oneWeekAgo = new Date()
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
  
  return workouts.filter(w => {
    const workoutDate = new Date(w.date)
    return workoutDate >= oneWeekAgo && w.completed
  })
}

export function getWeekStats() {
  const weekWorkouts = getWeekWorkouts()
  
  let totalVolume = 0
  let totalSets = 0
  let totalTime = 0
  
  weekWorkouts.forEach(workout => {
    totalTime += workout.duration || 0
    workout.exercises.forEach(ex => {
      ex.sets.forEach(set => {
        if (set.completed) {
          totalSets++
          totalVolume += set.weight * set.reps
        }
      })
    })
  })
  
  return {
    totalWorkouts: weekWorkouts.length,
    totalVolume,
    totalSets,
    totalTime,
  }
}

export function getLastWorkout(): Workout | undefined {
  const workouts = getWorkouts()
  return workouts.find(w => w.completed)
}

// Utility
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// Calcula o volume total de um treino
export function calculateWorkoutVolume(workout: Workout): number {
  let volume = 0
  workout.exercises.forEach(ex => {
    ex.sets.forEach(set => {
      if (set.completed) {
        volume += set.weight * set.reps
      }
    })
  })
  return volume
}

// Formata data para exibição
export function formatWorkoutDate(dateString: string): string {
  const date = new Date(dateString)
  const today = new Date()
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  
  if (date.toDateString() === today.toDateString()) {
    return 'Hoje'
  }
  if (date.toDateString() === yesterday.toDateString()) {
    return 'Ontem'
  }
  
  return date.toLocaleDateString('pt-BR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
}

// Formata duração em minutos
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`
  }
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`
}
