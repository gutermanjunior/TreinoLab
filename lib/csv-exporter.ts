import { Workout } from './types'
import { getExerciseById } from './exercises-data'

function escapeCSV(value: any): string {
  if (value === null || value === undefined) return ''
  const str = String(value)
  if (str.includes(',') || str.includes('\n') || str.includes('"')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

export function exportToCSV(workouts: Workout[]): string {
  const headers = [
    'workout',
    'start',
    'end',
    'exercise',
    'weight',
    'bodyweight',
    'assistingWeight',
    'extraWeight',
    'distanceKM',
    'reps',
    'calories',
    'time',
    'warmup',
    'max',
    'fail',
    'checked',
    'setComment',
    'workoutComment',
    'form',
    'sleep',
    'calories',
    'stress'
  ]

  let csvContent = headers.join(',') + '\n'

  for (const workout of workouts) {
    const startTs = new Date(workout.startTime || workout.date).getTime()
    const endTs = workout.endTime ? new Date(workout.endTime).getTime() : startTs + (workout.duration * 60000)
    
    // Fallback if no exercises exist we could still export workout info, but usually StrengthLog exports per-set
    if (!workout.exercises || workout.exercises.length === 0) continue

    for (const ex of workout.exercises) {
      const exerciseName = getExerciseById(ex.exerciseId)?.name || 'Unknown Exercise'
      
      for (const set of ex.sets) {
        // Handle time which might be stored in minutes
        let timeStr = ''
        if (set.time) {
           const h = Math.floor(set.time / 60)
           const m = Math.floor(set.time % 60)
           const s = Math.floor((set.time * 60) % 60)
           timeStr = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
        }

        const row = [
          escapeCSV(workout.name), // workout
          startTs.toString(), // start
          endTs.toString(), // end
          escapeCSV(exerciseName), // exercise
          set.weight > 0 ? set.weight.toString() : '', // weight
          set.bodyweight ? set.bodyweight.toString() : '', // bodyweight
          set.assistingWeight ? set.assistingWeight.toString() : '', // assistingWeight
          set.extraWeight ? set.extraWeight.toString() : '', // extraWeight
          set.distanceKM ? set.distanceKM.toString() : '', // distanceKM
          set.reps > 0 ? set.reps.toString() : '', // reps
          set.calories ? set.calories.toString() : '', // calories (1)
          timeStr, // time
          set.isWarmup ? 'true' : 'false', // warmup
          set.isMax ? 'true' : 'false', // max
          set.isFail ? 'true' : 'false', // fail
          set.completed ? 'true' : 'false', // checked
          escapeCSV(set.notes || ''), // setComment
          escapeCSV(workout.notes || ''), // workoutComment
          workout.formScore ? workout.formScore.toString() : '', // form
          workout.sleepScore ? workout.sleepScore.toString() : '', // sleep
          '', // calories (2 - StrengthLog bug replication mapping)
          workout.stressScore ? workout.stressScore.toString() : '' // stress
        ]
        
        csvContent += row.join(',') + '\n'
      }
    }
  }

  return csvContent
}
