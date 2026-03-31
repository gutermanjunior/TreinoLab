import { Workout, WorkoutExercise, WorkoutSet } from './types'
import { generateId } from './storage'
import { exercises } from './exercises-data'

function parseCSVLine(text: string): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < text.length; i++) {
    const char = text[i]
    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === ',' && !inQuotes) {
      result.push(current)
      current = ''
    } else {
      current += char
    }
  }
  result.push(current)
  return result
}

// Maps English CSV names to Database IDs
const exerciseAliasMap: Record<string, string> = {
  'Dumbbell Chest Press': 'supino-reto-halteres',
  'Lat Pulldown': 'puxada-frontal',
  'Cable Close-Grip Seated Row': 'cable-close-grip-row',
  'Dumbbell Lateral Raise': 'elevacao-lateral',
  'Tricep Pushdown With Rope': 'triceps-corda',
  'Tricep Pushdown With Bar': 'tricep-pushdown-bar',
  'Leg Extension': 'cadeira-extensora',
  'Lying Leg Curl': 'mesa-flexora',
  'Leg Press': 'leg-press',
  'Hip Thrust': 'hip-thrust',
  'Hip Abduction Machine': 'abdutora',
  'Seated Dumbbell Shoulder Press': 'desenvolvimento-halteres',
  'Dumbbell Shoulder Press': 'desenvolvimento-halteres',
  'Romanian Deadlift': 'stiff',
  'Barbell Curl': 'rosca-direta',
  'Barbell Preacher Curl': 'rosca-scott',
  'Dumbbell Preacher Curl': 'rosca-concentrada',
  'Overhead Cable Triceps Extension from Upper Position': 'overhead-cable-triceps-extension',
  'Dumbbell Shrug': 'encolhimento-ombros',
  'Standing Cable Chest Fly (Upper Position)': 'standing-cable-chest-fly',
  'Walking': 'walking',
  'Seated Leg Press': 'seated-leg-press',
  'Seated Leg Curl': 'seated-leg-curl',
  'Machine Back Extension': 'machine-back-extension',
  'Machine Shoulder Press': 'machine-shoulder-press',
  'Overhead Cable Triceps Extension': 'overhead-cable-triceps-extension',
  'Incline Machine Chest Press': 'incline-machine-chest-press',
  'Machine Lat Pulldown': 'machine-lat-pulldown',
  'Calf Raise in Leg Press': 'calf-raise-leg-press',
  'Cable Lateral Raise': 'cable-lateral-raise',
  'Assisted Pull-Up': 'assisted-pull-up',
  'Machine Lateral Raise': 'machine-lateral-raise',
  'Machine Bicep Curl': 'machine-bicep-curl',
  'Machine Chest Fly': 'machine-chest-fly',
  'Landmine Hack Squat': 'landmine-hack-squat',
  'Bulgarian Split Squat': 'bulgarian-split-squat',
  'Seated Calf Raise': 'seated-calf-raise',
  'Straight Arm Lat Pulldown': 'straight-arm-lat-pulldown',
  'Incline Dumbbell Press': 'incline-dumbbell-press',
  'Standing Glute Kickback in Machine': 'standing-glute-kickback',
  'Cable Incline Chest Fly': 'cable-incline-chest-fly',
  'Reverse Cable Fly': 'reverse-cable-fly',
  'Cable Curl With Bar': 'cable-curl-bar',
  'Incline Dumbbell Curl': 'incline-dumbbell-curl',
  'Cross Trainer (Elliptical)': 'cross-trainer',
  'Cable External Shoulder Rotation': 'cable-external-shoulder-rotation',
  'Machine Chest Press': 'machine-chest-press',
  'Cable Wide Grip Seated Row': 'cable-wide-grip-row',
  'Standing Leg Curl': 'standing-leg-curl',
  'One-Legged Leg Extension': 'one-legged-leg-extension',
  'Hip Adduction Machine': 'hip-adduction',
}

function normalizeExerciseId(csvName: string): string {
  const mapped = exerciseAliasMap[csvName]
  if (mapped) return mapped
  
  // Try to find natural match
  const lowerQuery = csvName.toLowerCase()
  const exact = exercises.find(e => e.name.toLowerCase() === lowerQuery)
  if (exact) return exact.id
  
  // Default fallback if really unknown, prevent crashing
  return 'supino-reto-barra' // Just a safe fallback
}

export function parseStrengthLogCSV(csvText: string): Workout[] {
  const lines = csvText.split('\n').filter(line => line.trim().length > 0)
  if (lines.length < 2) return []

  const header = parseCSVLine(lines[0]).map(h => h.trim())
  
  const workoutsMap = new Map<string, Workout>()

  for (let i = 1; i < lines.length; i++) {
    const cols = parseCSVLine(lines[i])
    if (cols.length < header.length) continue // Skip malformed rows
    
    const row: Record<string, string> = {}
    let calIndex = 0
    header.forEach((h, index) => {
      if (h === 'calories') {
        if (calIndex === 0) { row['calories'] = cols[index]; calIndex++ }
        else { row['calories2'] = cols[index] }
      } else {
        row[h] = cols[index]
      }
    })

    const workoutName = row['workout'] || 'Workout'
    const startTs = parseInt(row['start'] || '0')
    const endTs = parseInt(row['end'] || '0')
    const exerciseName = row['exercise']
    
    if (!startTs || !exerciseName) continue
    
    // Get or Create Workout
    const workoutKey = `${startTs}`
    if (!workoutsMap.has(workoutKey)) {
      workoutsMap.set(workoutKey, {
        id: generateId(),
        name: workoutName,
        date: new Date(startTs).toISOString(),
        startTime: new Date(startTs).toISOString(),
        endTime: endTs ? new Date(endTs).toISOString() : undefined,
        duration: endTs > startTs ? Math.floor((endTs - startTs) / 60000) : 0,
        completed: true,
        exercises: [],
        notes: row['workoutComment']?.trim() || undefined,
        formScore: parseInt(row['form']) || undefined,
        sleepScore: parseInt(row['sleep']) || undefined,
        stressScore: parseInt(row['stress']) || undefined,
      })
    }
    const workout = workoutsMap.get(workoutKey)!
    
    // Map Exercise
    const exerciseId = normalizeExerciseId(exerciseName)
    
    // Check if exercise already exists in this workout to append sets
    let currentExercise = workout.exercises[workout.exercises.length - 1]
    
    if (!currentExercise || currentExercise.exerciseId !== exerciseId) {
      currentExercise = {
        id: generateId(),
        exerciseId,
        sets: [],
        restTime: 60,
      }
      workout.exercises.push(currentExercise)
    }

    // Prepare Set
    const weightNum = parseFloat(row['weight']) || 0
    const repsNum = parseInt(row['reps']) || 0
    
    const setObj: WorkoutSet = {
      id: generateId(),
      weight: weightNum,
      reps: repsNum,
      completed: row['checked'] ? row['checked'] !== 'false' && row['checked'] !== '' : true,
      notes: row['setComment']?.trim() || undefined,
      isWarmup: row['warmup'] === 'true',
      isFail: row['fail'] === 'true',
      isMax: row['max'] === 'true',
      bodyweight: parseFloat(row['bodyweight']) || undefined,
      assistingWeight: parseFloat(row['assistingWeight']) || undefined,
      extraWeight: parseFloat(row['extraWeight']) || undefined,
      distanceKM: parseFloat(row['distanceKM']) || undefined,
      calories: parseFloat(row['calories']) || parseFloat(row['calories2']) || undefined,
    }

    if (row['time'] && row['time'].includes(':')) {
       const parts = row['time'].split(':')
       if (parts.length === 3) {
         const h = parseInt(parts[0]) || 0
         const m = parseInt(parts[1]) || 0
         const s = parseInt(parts[2]) || 0
         setObj.time = h * 60 + m + (s / 60) // minutes
       }
    } else if (parseFloat(row['time'])) {
       setObj.time = parseFloat(row['time'])
    }
    
    if (weightNum > 0 || repsNum > 0 || (setObj.distanceKM || 0) > 0 || (setObj.time || 0) > 0 || (setObj.assistingWeight || 0) > 0 || (setObj.bodyweight || 0) > 0) {
      currentExercise.sets.push(setObj)
    } else if (setObj.notes || setObj.isWarmup || setObj.isFail) {
      // Force keeping if it has comments or markers even without weight
      currentExercise.sets.push(setObj)
    }
  }

  return Array.from(workoutsMap.values()).sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )
}
