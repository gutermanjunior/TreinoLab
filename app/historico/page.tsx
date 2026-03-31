'use client'

import { useEffect, useState } from 'react'
import { Calendar, ChevronDown, ChevronUp, Trash2, Clock, TrendingUp } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { Empty, EmptyMedia, EmptyTitle, EmptyDescription } from '@/components/ui/empty'
import { 
  getWorkouts, 
  deleteWorkout, 
  formatWorkoutDate, 
  formatDuration,
  calculateWorkoutVolume 
} from '@/lib/storage'
import { getExerciseById } from '@/lib/exercises-data'
import { Workout } from '@/lib/types'

export default function HistoryPage() {
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setWorkouts(getWorkouts().filter(w => w.completed))
    setIsLoading(false)
  }, [])

  const handleDelete = () => {
    if (deleteId) {
      deleteWorkout(deleteId)
      setWorkouts(prev => prev.filter(w => w.id !== deleteId))
      setDeleteId(null)
    }
  }

  // Agrupa treinos por mês
  const groupedWorkouts = workouts.reduce((groups, workout) => {
    const date = new Date(workout.date)
    const monthKey = `${date.getFullYear()}-${date.getMonth()}`
    const monthLabel = date.toLocaleDateString('pt-BR', { 
      month: 'long', 
      year: 'numeric' 
    })
    
    if (!groups[monthKey]) {
      groups[monthKey] = { label: monthLabel, workouts: [] }
    }
    groups[monthKey].workouts.push(workout)
    return groups
  }, {} as Record<string, { label: string; workouts: Workout[] }>)

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
      <header className="pt-2">
        <h1 className="text-2xl font-bold">Histórico</h1>
        <p className="text-muted-foreground">
          {workouts.length} treino{workouts.length !== 1 ? 's' : ''} registrado{workouts.length !== 1 ? 's' : ''}
        </p>
      </header>

      {workouts.length === 0 ? (
        <Empty className="py-12">
          <EmptyMedia>
            <Calendar className="h-10 w-10" />
          </EmptyMedia>
          <EmptyTitle>Nenhum treino registrado</EmptyTitle>
          <EmptyDescription>
            Complete seu primeiro treino para vê-lo aqui
          </EmptyDescription>
        </Empty>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedWorkouts).map(([monthKey, { label, workouts: monthWorkouts }]) => (
            <section key={monthKey}>
              <h2 className="mb-3 text-sm font-medium capitalize text-muted-foreground">
                {label}
              </h2>
              <div className="space-y-3">
                {monthWorkouts.map(workout => {
                  const volume = calculateWorkoutVolume(workout)
                  const isExpanded = expandedId === workout.id
                  const totalSets = workout.exercises.reduce(
                    (acc, ex) => acc + ex.sets.filter(s => s.completed).length, 
                    0
                  )

                  return (
                    <Card key={workout.id}>
                      <Collapsible 
                        open={isExpanded} 
                        onOpenChange={() => setExpandedId(isExpanded ? null : workout.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold">{workout.name}</h3>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {formatWorkoutDate(workout.date)}
                              </p>
                              
                              <div className="mt-2 flex flex-wrap gap-3 text-sm">
                                <span className="flex items-center gap-1 text-muted-foreground">
                                  <Clock className="h-3.5 w-3.5" />
                                  {formatDuration(workout.duration)}
                                </span>
                                <span className="flex items-center gap-1 text-muted-foreground">
                                  <TrendingUp className="h-3.5 w-3.5" />
                                  {volume.toLocaleString('pt-BR')} kg
                                </span>
                                <Badge variant="secondary" className="text-xs">
                                  {totalSets} séries
                                </Badge>
                              </div>
                            </div>

                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setDeleteId(workout.id)
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                              <CollapsibleTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  {isExpanded ? (
                                    <ChevronUp className="h-4 w-4" />
                                  ) : (
                                    <ChevronDown className="h-4 w-4" />
                                  )}
                                </Button>
                              </CollapsibleTrigger>
                            </div>
                          </div>

                          <CollapsibleContent>
                            <div className="mt-4 space-y-3 border-t pt-4">
                              {workout.exercises.map(workoutExercise => {
                                const exercise = getExerciseById(workoutExercise.exerciseId)
                                if (!exercise) return null

                                const completedSets = workoutExercise.sets.filter(s => s.completed)

                                return (
                                  <div key={workoutExercise.id}>
                                    <p className="text-sm font-medium">{exercise.name}</p>
                                    <div className="mt-1 flex flex-wrap gap-2">
                                      {completedSets.map((set, idx) => (
                                        <Badge 
                                          key={set.id} 
                                          variant={set.isPersonalRecord ? 'default' : 'secondary'}
                                          className="text-xs"
                                        >
                                          {set.weight}kg × {set.reps}
                                          {set.isPersonalRecord && ' PR'}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                          </CollapsibleContent>
                        </CardContent>
                      </Collapsible>
                    </Card>
                  )
                })}
              </div>
            </section>
          ))}
        </div>
      )}

      {/* Dialog de confirmação de exclusão */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir treino?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O treino será removido permanentemente do seu histórico.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
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
