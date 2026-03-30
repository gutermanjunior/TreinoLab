'use client'

import { useState, useEffect, useCallback } from 'react'
import { Workout, WorkoutExercise, WorkoutSet } from '@/lib/types'
import { 
  getCurrentWorkout, 
  saveCurrentWorkout, 
  saveWorkout, 
  clearCurrentWorkout,
  generateId,
  checkAndUpdatePR,
  getSettings
} from '@/lib/storage'

export function useWorkout() {
  const [workout, setWorkout] = useState<Workout | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Carrega treino em andamento do localStorage
  useEffect(() => {
    const current = getCurrentWorkout()
    setWorkout(current)
    setIsLoading(false)
  }, [])

  // Salva automaticamente quando o treino muda
  useEffect(() => {
    if (!isLoading) {
      saveCurrentWorkout(workout)
    }
  }, [workout, isLoading])

  // Inicia um novo treino
  const startWorkout = useCallback((name: string, exercises: WorkoutExercise[] = []) => {
    const newWorkout: Workout = {
      id: generateId(),
      name,
      date: new Date().toISOString(),
      startTime: new Date().toISOString(),
      exercises,
      duration: 0,
      completed: false,
    }
    setWorkout(newWorkout)
    return newWorkout
  }, [])

  // Adiciona exercício ao treino
  const addExercise = useCallback((exerciseId: string) => {
    if (!workout) return
    
    const settings = getSettings()
    const newExercise: WorkoutExercise = {
      id: generateId(),
      exerciseId,
      sets: [
        { id: generateId(), weight: 0, reps: 0, completed: false },
        { id: generateId(), weight: 0, reps: 0, completed: false },
        { id: generateId(), weight: 0, reps: 0, completed: false },
      ],
      restTime: settings.defaultRestTime,
    }
    
    setWorkout(prev => prev ? {
      ...prev,
      exercises: [...prev.exercises, newExercise],
    } : null)
  }, [workout])

  // Remove exercício do treino
  const removeExercise = useCallback((exerciseId: string) => {
    setWorkout(prev => prev ? {
      ...prev,
      exercises: prev.exercises.filter(ex => ex.id !== exerciseId),
    } : null)
  }, [])

  // Adiciona série a um exercício
  const addSet = useCallback((workoutExerciseId: string) => {
    setWorkout(prev => {
      if (!prev) return null
      
      return {
        ...prev,
        exercises: prev.exercises.map(ex => {
          if (ex.id !== workoutExerciseId) return ex
          
          // Copia peso e reps da última série como sugestão
          const lastSet = ex.sets[ex.sets.length - 1]
          const newSet: WorkoutSet = {
            id: generateId(),
            weight: lastSet?.weight || 0,
            reps: lastSet?.reps || 0,
            completed: false,
          }
          
          return {
            ...ex,
            sets: [...ex.sets, newSet],
          }
        }),
      }
    })
  }, [])

  // Remove série de um exercício
  const removeSet = useCallback((workoutExerciseId: string, setId: string) => {
    setWorkout(prev => {
      if (!prev) return null
      
      return {
        ...prev,
        exercises: prev.exercises.map(ex => {
          if (ex.id !== workoutExerciseId) return ex
          
          return {
            ...ex,
            sets: ex.sets.filter(s => s.id !== setId),
          }
        }),
      }
    })
  }, [])

  // Atualiza uma série
  const updateSet = useCallback((
    workoutExerciseId: string, 
    setId: string, 
    updates: Partial<WorkoutSet>
  ) => {
    setWorkout(prev => {
      if (!prev) return null
      
      return {
        ...prev,
        exercises: prev.exercises.map(ex => {
          if (ex.id !== workoutExerciseId) return ex
          
          return {
            ...ex,
            sets: ex.sets.map(set => {
              if (set.id !== setId) return set
              return { ...set, ...updates }
            }),
          }
        }),
      }
    })
  }, [])

  // Completa uma série e verifica PR
  const completeSet = useCallback((
    workoutExerciseId: string, 
    setId: string,
    weight: number,
    reps: number
  ): boolean => {
    let isPR = false
    
    setWorkout(prev => {
      if (!prev) return null
      
      const exercise = prev.exercises.find(ex => ex.id === workoutExerciseId)
      if (exercise) {
        const set: WorkoutSet = { id: setId, weight, reps, completed: true }
        isPR = checkAndUpdatePR(exercise.exerciseId, set, prev.id)
      }
      
      return {
        ...prev,
        exercises: prev.exercises.map(ex => {
          if (ex.id !== workoutExerciseId) return ex
          
          return {
            ...ex,
            sets: ex.sets.map(set => {
              if (set.id !== setId) return set
              return { 
                ...set, 
                weight, 
                reps, 
                completed: true,
                isPersonalRecord: isPR,
              }
            }),
          }
        }),
      }
    })
    
    return isPR
  }, [])

  // Atualiza tempo de descanso de um exercício
  const updateRestTime = useCallback((workoutExerciseId: string, restTime: number) => {
    setWorkout(prev => {
      if (!prev) return null
      
      return {
        ...prev,
        exercises: prev.exercises.map(ex => {
          if (ex.id !== workoutExerciseId) return ex
          return { ...ex, restTime }
        }),
      }
    })
  }, [])

  // Finaliza o treino
  const finishWorkout = useCallback(() => {
    if (!workout) return null
    
    const endTime = new Date()
    const startTime = new Date(workout.startTime || workout.date)
    const duration = Math.round((endTime.getTime() - startTime.getTime()) / 60000)
    
    const completedWorkout: Workout = {
      ...workout,
      endTime: endTime.toISOString(),
      duration,
      completed: true,
    }
    
    saveWorkout(completedWorkout)
    clearCurrentWorkout()
    setWorkout(null)
    
    return completedWorkout
  }, [workout])

  // Cancela o treino atual
  const cancelWorkout = useCallback(() => {
    clearCurrentWorkout()
    setWorkout(null)
  }, [])

  // Reordena exercícios
  const reorderExercises = useCallback((fromIndex: number, toIndex: number) => {
    setWorkout(prev => {
      if (!prev) return null
      
      const exercises = [...prev.exercises]
      const [removed] = exercises.splice(fromIndex, 1)
      exercises.splice(toIndex, 0, removed)
      
      return { ...prev, exercises }
    })
  }, [])

  return {
    workout,
    isLoading,
    isActive: !!workout,
    startWorkout,
    addExercise,
    removeExercise,
    addSet,
    removeSet,
    updateSet,
    completeSet,
    updateRestTime,
    finishWorkout,
    cancelWorkout,
    reorderExercises,
  }
}
