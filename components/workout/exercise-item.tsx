'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, Plus, Trash2, Timer, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from '@/components/ui/collapsible'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { SetRow } from './set-row'
import { WorkoutExercise, WorkoutSet, MUSCLE_GROUP_LABELS } from '@/lib/types'
import { getExerciseById } from '@/lib/exercises-data'
import { cn } from '@/lib/utils'

interface ExerciseItemProps {
  workoutExercise: WorkoutExercise
  onAddSet: () => void
  onRemoveSet: (setId: string) => void
  onUpdateSet: (setId: string, updates: Partial<WorkoutSet>) => void
  onCompleteSet: (setId: string, weight: number, reps: number) => boolean
  onRemoveExercise: () => void
  onStartTimer: (duration: number) => void
}

export function ExerciseItem({
  workoutExercise,
  onAddSet,
  onRemoveSet,
  onUpdateSet,
  onCompleteSet,
  onRemoveExercise,
  onStartTimer,
}: ExerciseItemProps) {
  const [isOpen, setIsOpen] = useState(true)
  const [showInstructions, setShowInstructions] = useState(false)
  
  const exercise = getExerciseById(workoutExercise.exerciseId)
  
  if (!exercise) return null

  const completedSets = workoutExercise.sets.filter(s => s.completed).length
  const totalSets = workoutExercise.sets.length

  const handleCompleteSet = (setId: string, weight: number, reps: number) => {
    const isPR = onCompleteSet(setId, weight, reps)
    
    // Inicia o timer automaticamente após completar uma série
    onStartTimer(workoutExercise.restTime)
    
    return isPR
  }

  return (
    <>
      <Card className="overflow-hidden">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CardHeader className="p-3">
            <div className="flex items-center gap-3">
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                  {isOpen ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
              
              <div className="min-w-0 flex-1">
                <h3 className="truncate font-semibold leading-tight">
                  {exercise.name}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {MUSCLE_GROUP_LABELS[exercise.muscleGroup]} • {completedSets}/{totalSets} séries
                </p>
              </div>
              
              <div className="flex shrink-0 items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowInstructions(true)}
                  className="h-8 w-8"
                >
                  <Info className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onRemoveExercise}
                  className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          <CollapsibleContent>
            <CardContent className="p-3 pt-0">
              {/* Header das colunas */}
              <div className="mb-2 flex items-center gap-2 px-2 text-xs font-medium text-muted-foreground">
                <div className="w-8 shrink-0 text-center">Série</div>
                <div className="hidden w-20 shrink-0 text-center sm:block">Anterior</div>
                <div className="flex-1 text-center">Peso</div>
                <div className="flex-1 text-center">Reps</div>
                <div className="w-10 shrink-0" />
              </div>

              {/* Lista de séries */}
              <div className="space-y-1">
                {workoutExercise.sets.map((set, index) => (
                  <SetRow
                    key={set.id}
                    set={set}
                    setNumber={index + 1}
                    onComplete={(weight, reps) => handleCompleteSet(set.id, weight, reps)}
                    onUpdate={(updates) => onUpdateSet(set.id, updates)}
                    onRemove={() => onRemoveSet(set.id)}
                    showRemove={workoutExercise.sets.length > 1}
                  />
                ))}
              </div>

              {/* Ações */}
              <div className="mt-3 flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onAddSet}
                  className="flex-1"
                >
                  <Plus className="mr-1 h-4 w-4" />
                  Adicionar Série
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onStartTimer(workoutExercise.restTime)}
                  className="shrink-0"
                >
                  <Timer className="mr-1 h-4 w-4" />
                  {Math.floor(workoutExercise.restTime / 60)}:{(workoutExercise.restTime % 60).toString().padStart(2, '0')}
                </Button>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Modal de instruções */}
      <Dialog open={showInstructions} onOpenChange={setShowInstructions}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{exercise.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">
                {MUSCLE_GROUP_LABELS[exercise.muscleGroup]}
              </p>
            </div>
            <div>
              <h4 className="mb-2 font-medium">Como executar:</h4>
              <ol className="space-y-2 text-sm text-muted-foreground">
                {exercise.instructions.map((instruction, index) => (
                  <li key={index} className="flex gap-2">
                    <span className="shrink-0 font-medium text-foreground">
                      {index + 1}.
                    </span>
                    {instruction}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
