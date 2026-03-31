'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Play, Edit2, Trash2, Search, ListChecks } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import { Empty, EmptyMedia, EmptyTitle, EmptyDescription } from '@/components/ui/empty'
import { 
  getRoutines, 
  saveRoutine, 
  deleteRoutine, 
  generateId,
  getSettings 
} from '@/lib/storage'
import { exercises, searchExercises } from '@/lib/exercises-data'
import { Routine, RoutineExercise, MUSCLE_GROUP_LABELS, MuscleGroup } from '@/lib/types'
import { cn } from '@/lib/utils'

export default function RoutinesPage() {
  const router = useRouter()
  const [routines, setRoutines] = useState<Routine[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showEditor, setShowEditor] = useState(false)
  const [editingRoutine, setEditingRoutine] = useState<Routine | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  // Editor state
  const [routineName, setRoutineName] = useState('')
  const [routineExercises, setRoutineExercises] = useState<RoutineExercise[]>([])
  const [showExercisePicker, setShowExercisePicker] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    setRoutines(getRoutines())
    setIsLoading(false)
  }, [])

  const handleStartRoutine = (routine: Routine) => {
    const newWorkout = {
      id: generateId(),
      name: routine.name,
      date: new Date().toISOString(),
      startTime: new Date().toISOString(),
      exercises: routine.exercises.map(re => ({
        id: generateId(),
        exerciseId: re.exerciseId,
        sets: Array.from({ length: re.sets }, () => ({
          id: generateId(),
          weight: 0,
          reps: 0,
          completed: false,
        })),
        restTime: re.restTime,
      })),
      duration: 0,
      completed: false,
      routineId: routine.id,
    }
    
    localStorage.setItem('registro-forca-current', JSON.stringify(newWorkout))
    router.push(`/treino/${newWorkout.id}`)
  }

  const handleEditRoutine = (routine: Routine) => {
    setEditingRoutine(routine)
    setRoutineName(routine.name)
    setRoutineExercises(routine.exercises)
    setShowEditor(true)
  }

  const handleNewRoutine = () => {
    setEditingRoutine(null)
    setRoutineName('')
    setRoutineExercises([])
    setShowEditor(true)
  }

  const handleSaveRoutine = () => {
    if (!routineName.trim() || routineExercises.length === 0) return

    const routine: Routine = {
      id: editingRoutine?.id || generateId(),
      name: routineName.trim(),
      exercises: routineExercises,
      createdAt: editingRoutine?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    saveRoutine(routine)
    setRoutines(getRoutines())
    setShowEditor(false)
    setRoutineName('')
    setRoutineExercises([])
    setEditingRoutine(null)
  }

  const handleDeleteRoutine = () => {
    if (deleteId) {
      deleteRoutine(deleteId)
      setRoutines(prev => prev.filter(r => r.id !== deleteId))
      setDeleteId(null)
    }
  }

  const handleAddExercise = (exerciseId: string) => {
    const settings = getSettings()
    setRoutineExercises(prev => [
      ...prev,
      { exerciseId, sets: 3, restTime: settings.defaultRestTime }
    ])
    setShowExercisePicker(false)
    setSearchQuery('')
  }

  const handleRemoveExercise = (index: number) => {
    setRoutineExercises(prev => prev.filter((_, i) => i !== index))
  }

  const handleUpdateSets = (index: number, sets: number) => {
    setRoutineExercises(prev => prev.map((ex, i) => 
      i === index ? { ...ex, sets: Math.max(1, sets) } : ex
    ))
  }

  const filteredExercises = searchQuery 
    ? searchExercises(searchQuery) 
    : exercises

  const exercisesInRoutine = new Set(routineExercises.map(e => e.exerciseId))

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Header */}
      <header className="flex items-start justify-between pt-2">
        <div>
          <h1 className="text-2xl font-bold">Rotinas</h1>
          <p className="text-muted-foreground">
            Treinos pré-configurados
          </p>
        </div>
        <Button onClick={handleNewRoutine}>
          <Plus className="mr-2 h-4 w-4" />
          Nova
        </Button>
      </header>

      {routines.length === 0 ? (
        <Empty className="py-12">
          <EmptyMedia>
            <ListChecks className="h-10 w-10" />
          </EmptyMedia>
          <EmptyTitle>Nenhuma rotina criada</EmptyTitle>
          <EmptyDescription>
            Crie rotinas para iniciar treinos mais rapidamente
          </EmptyDescription>
          <Button onClick={handleNewRoutine} className="mt-4">
            <Plus className="mr-2 h-4 w-4" />
            Criar Rotina
          </Button>
        </Empty>
      ) : (
        <div className="space-y-3">
          {routines.map(routine => {
            const exerciseNames = routine.exercises
              .map(re => exercises.find(e => e.id === re.exerciseId)?.name)
              .filter(Boolean)
              .slice(0, 3)

            return (
              <Card key={routine.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold">{routine.name}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {routine.exercises.length} exercícios
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {exerciseNames.map((name, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {name}
                          </Badge>
                        ))}
                        {routine.exercises.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{routine.exercises.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleEditRoutine(routine)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => setDeleteId(routine.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="default"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleStartRoutine(routine)}
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Editor de rotina */}
      <Dialog open={showEditor} onOpenChange={setShowEditor}>
        <DialogContent className="flex h-[80vh] max-h-[600px] flex-col p-0">
          <DialogHeader className="border-b p-4">
            <DialogTitle>
              {editingRoutine ? 'Editar Rotina' : 'Nova Rotina'}
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="routine-name">Nome da rotina</Label>
                <Input
                  id="routine-name"
                  placeholder="Ex: Treino A - Peito e Tríceps"
                  value={routineName}
                  onChange={e => setRoutineName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Exercícios</Label>
                {routineExercises.length === 0 ? (
                  <div className="rounded-lg border border-dashed p-6 text-center">
                    <p className="text-sm text-muted-foreground">
                      Nenhum exercício adicionado
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {routineExercises.map((re, index) => {
                      const exercise = exercises.find(e => e.id === re.exerciseId)
                      if (!exercise) return null

                      return (
                        <div 
                          key={index}
                          className="flex items-center justify-between rounded-lg border p-3"
                        >
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium">
                              {exercise.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {MUSCLE_GROUP_LABELS[exercise.muscleGroup]}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => handleUpdateSets(index, re.sets - 1)}
                                disabled={re.sets <= 1}
                              >
                                -
                              </Button>
                              <span className="w-8 text-center text-sm">
                                {re.sets}
                              </span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => handleUpdateSets(index, re.sets + 1)}
                              >
                                +
                              </Button>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-destructive"
                              onClick={() => handleRemoveExercise(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}

                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setShowExercisePicker(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Exercício
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter className="border-t p-4">
            <Button variant="outline" onClick={() => setShowEditor(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleSaveRoutine}
              disabled={!routineName.trim() || routineExercises.length === 0}
            >
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Picker de exercício */}
      <Dialog open={showExercisePicker} onOpenChange={setShowExercisePicker}>
        <DialogContent className="flex h-[70vh] max-h-[500px] flex-col p-0">
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

          <ScrollArea className="flex-1">
            <div className="divide-y">
              {filteredExercises.map(exercise => {
                const isInRoutine = exercisesInRoutine.has(exercise.id)
                
                return (
                  <button
                    key={exercise.id}
                    onClick={() => !isInRoutine && handleAddExercise(exercise.id)}
                    disabled={isInRoutine}
                    className={cn(
                      'flex w-full items-center justify-between p-4 text-left transition-colors',
                      isInRoutine 
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
                    {isInRoutine && (
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

      {/* Confirmação de exclusão */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir rotina?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteRoutine}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
