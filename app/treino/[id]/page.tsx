'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Plus, Check, X, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ExerciseItem } from '@/components/workout/exercise-item'
import { RestTimer } from '@/components/workout/rest-timer'
import { useWorkout } from '@/hooks/use-workout'
import { exercises, searchExercises } from '@/lib/exercises-data'
import { MUSCLE_GROUP_LABELS, MuscleGroup } from '@/lib/types'
import { cn } from '@/lib/utils'

const muscleGroups: MuscleGroup[] = [
  'peito', 'costas', 'ombros', 'biceps', 'triceps', 
  'pernas', 'gluteos', 'abdomen'
]

export default function WorkoutPage() {
  const router = useRouter()
  const params = useParams()
  const {
    workout,
    isLoading,
    addExercise,
    removeExercise,
    addSet,
    removeSet,
    updateSet,
    completeSet,
    finishWorkout,
    cancelWorkout,
  } = useWorkout()

  const [showExercisePicker, setShowExercisePicker] = useState(false)
  const [showFinishDialog, setShowFinishDialog] = useState(false)
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedGroup, setSelectedGroup] = useState<MuscleGroup | null>(null)
  const [timerOpen, setTimerOpen] = useState(false)
  const [timerDuration, setTimerDuration] = useState(90)

  // Calcula tempo decorrido
  const [elapsedTime, setElapsedTime] = useState('0:00')

  useEffect(() => {
    if (!workout?.startTime) return

    const updateElapsed = () => {
      const start = new Date(workout.startTime!).getTime()
      const now = Date.now()
      const diff = Math.floor((now - start) / 1000)
      const mins = Math.floor(diff / 60)
      const secs = diff % 60
      setElapsedTime(`${mins}:${secs.toString().padStart(2, '0')}`)
    }

    updateElapsed()
    const interval = setInterval(updateElapsed, 1000)
    return () => clearInterval(interval)
  }, [workout?.startTime])

  // Redireciona se não houver treino
  useEffect(() => {
    if (!isLoading && !workout) {
      router.push('/')
    }
  }, [isLoading, workout, router])

  const handleAddExercise = (exerciseId: string) => {
    addExercise(exerciseId)
    setShowExercisePicker(false)
    setSearchQuery('')
    setSelectedGroup(null)
  }

  const handleFinishWorkout = () => {
    const completed = finishWorkout()
    if (completed) {
      router.push('/')
    }
  }

  const handleCancelWorkout = () => {
    cancelWorkout()
    router.push('/')
  }

  const handleStartTimer = useCallback((duration: number) => {
    setTimerDuration(duration)
    setTimerOpen(true)
  }, [])

  // Filtra exercícios para o picker
  const filteredExercises = searchQuery 
    ? searchExercises(searchQuery)
    : selectedGroup 
      ? exercises.filter(ex => ex.muscleGroup === selectedGroup)
      : exercises

  // Exercícios já no treino
  const exercisesInWorkout = new Set(workout?.exercises.map(e => e.exerciseId) || [])

  if (isLoading || !workout) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  const completedSets = workout.exercises.reduce(
    (acc, ex) => acc + ex.sets.filter(s => s.completed).length, 
    0
  )
  const totalSets = workout.exercises.reduce((acc, ex) => acc + ex.sets.length, 0)

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header fixo */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setShowCancelDialog(true)}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-sm font-semibold leading-tight">{workout.name}</h1>
              <p className="text-xs text-muted-foreground">{elapsedTime}</p>
            </div>
          </div>
          
          <Button 
            onClick={() => setShowFinishDialog(true)}
            size="sm"
            disabled={completedSets === 0}
          >
            <Check className="mr-1 h-4 w-4" />
            Finalizar
          </Button>
        </div>
        
        {/* Barra de progresso */}
        <div className="h-1 bg-muted">
          <div 
            className="h-full bg-primary transition-all duration-300"
            style={{ width: totalSets > 0 ? `${(completedSets / totalSets) * 100}%` : '0%' }}
          />
        </div>
      </header>

      {/* Lista de exercícios */}
      <div className="flex-1 p-4">
        {workout.exercises.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="mb-4 text-muted-foreground">
              Nenhum exercício adicionado ainda
            </p>
            <Button onClick={() => setShowExercisePicker(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Exercício
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {workout.exercises.map(workoutExercise => (
              <ExerciseItem
                key={workoutExercise.id}
                workoutExercise={workoutExercise}
                onAddSet={() => addSet(workoutExercise.id)}
                onRemoveSet={(setId) => removeSet(workoutExercise.id, setId)}
                onUpdateSet={(setId, updates) => updateSet(workoutExercise.id, setId, updates)}
                onCompleteSet={(setId, weight, reps) => completeSet(workoutExercise.id, setId, weight, reps)}
                onRemoveExercise={() => removeExercise(workoutExercise.id)}
                onStartTimer={handleStartTimer}
              />
            ))}
            
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => setShowExercisePicker(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Exercício
            </Button>
          </div>
        )}
      </div>

      {/* Timer de descanso */}
      <RestTimer
        isOpen={timerOpen}
        duration={timerDuration}
        onClose={() => setTimerOpen(false)}
      />

      {/* Dialog para escolher exercício */}
      <Dialog open={showExercisePicker} onOpenChange={setShowExercisePicker}>
        <DialogContent className="flex h-[80vh] max-h-[600px] flex-col p-0">
          <DialogHeader className="border-b p-4">
            <DialogTitle>Adicionar Exercício</DialogTitle>
            <div className="relative mt-2">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar exercício..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </DialogHeader>

          {/* Filtros por grupo muscular */}
          {!searchQuery && (
            <div className="flex gap-2 overflow-x-auto border-b px-4 py-2">
              <Button
                variant={selectedGroup === null ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedGroup(null)}
                className="shrink-0"
              >
                Todos
              </Button>
              {muscleGroups.map(group => (
                <Button
                  key={group}
                  variant={selectedGroup === group ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedGroup(group)}
                  className="shrink-0"
                >
                  {MUSCLE_GROUP_LABELS[group]}
                </Button>
              ))}
            </div>
          )}

          {/* Lista de exercícios */}
          <ScrollArea className="flex-1">
            <div className="divide-y">
              {filteredExercises.map(exercise => {
                const isInWorkout = exercisesInWorkout.has(exercise.id)
                
                return (
                  <button
                    key={exercise.id}
                    onClick={() => !isInWorkout && handleAddExercise(exercise.id)}
                    disabled={isInWorkout}
                    className={cn(
                      'flex w-full items-center justify-between p-4 text-left transition-colors',
                      isInWorkout 
                        ? 'cursor-not-allowed opacity-50' 
                        : 'hover:bg-muted/50'
                    )}
                  >
                    <div>
                      <p className="font-medium">{exercise.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {MUSCLE_GROUP_LABELS[exercise.muscleGroup]}
                      </p>
                    </div>
                    {isInWorkout && (
                      <span className="text-xs text-muted-foreground">
                        Já adicionado
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Dialog de finalizar treino */}
      <AlertDialog open={showFinishDialog} onOpenChange={setShowFinishDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Finalizar treino?</AlertDialogTitle>
            <AlertDialogDescription>
              Você completou {completedSets} de {totalSets} séries. 
              O treino será salvo no seu histórico.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continuar treinando</AlertDialogCancel>
            <AlertDialogAction onClick={handleFinishWorkout}>
              Finalizar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog de cancelar treino */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Descartar treino?</AlertDialogTitle>
            <AlertDialogDescription>
              Seu progresso não será salvo. Tem certeza que deseja sair?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continuar treinando</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleCancelWorkout}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              <X className="mr-1 h-4 w-4" />
              Descartar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
