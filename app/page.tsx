'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Play, Dumbbell, Trophy, TrendingUp, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  getCurrentWorkout, 
  getWeekStats, 
  getLastWorkout,
  getRoutines,
  formatWorkoutDate,
  formatDuration,
  generateId,
  calculateWorkoutVolume,
} from '@/lib/storage'
import { Workout, Routine, WeekStats } from '@/lib/types'

export default function HomePage() {
  const router = useRouter()
  const [currentWorkout, setCurrentWorkout] = useState<Workout | null>(null)
  const [weekStats, setWeekStats] = useState<WeekStats | null>(null)
  const [lastWorkout, setLastWorkout] = useState<Workout | null>(null)
  const [routines, setRoutines] = useState<Routine[]>([])
  const [showNewWorkout, setShowNewWorkout] = useState(false)
  const [workoutName, setWorkoutName] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setCurrentWorkout(getCurrentWorkout())
    setWeekStats(getWeekStats())
    setLastWorkout(getLastWorkout() || null)
    setRoutines(getRoutines())
    setIsLoading(false)
  }, [])

  const handleStartWorkout = () => {
    const name = workoutName.trim() || `Treino ${new Date().toLocaleDateString('pt-BR')}`
    const newWorkout: Workout = {
      id: generateId(),
      name,
      date: new Date().toISOString(),
      startTime: new Date().toISOString(),
      exercises: [],
      duration: 0,
      completed: false,
    }
    
    localStorage.setItem('treinolab-current', JSON.stringify(newWorkout))
    router.push(`/treino/${newWorkout.id}`)
  }

  const handleContinueWorkout = () => {
    if (currentWorkout) {
      router.push(`/treino/${currentWorkout.id}`)
    }
  }

  const handleStartFromRoutine = (routine: Routine) => {
    const newWorkout: Workout = {
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
    
    localStorage.setItem('treinolab-current', JSON.stringify(newWorkout))
    router.push(`/treino/${newWorkout.id}`)
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 p-4">
      {/* Header */}
      <header className="pt-2">
        <h1 className="text-2xl font-bold">TreinoLab</h1>
        <p className="text-muted-foreground">
          {new Date().toLocaleDateString('pt-BR', { 
            weekday: 'long', 
            day: 'numeric', 
            month: 'long' 
          })}
        </p>
      </header>

      {/* Treino em andamento ou botão de iniciar */}
      {currentWorkout ? (
        <Card className="border-primary bg-primary/5">
          <CardContent className="p-4">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Dumbbell className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold">{currentWorkout.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {currentWorkout.exercises.length} exercícios
                </p>
              </div>
            </div>
            <Button 
              onClick={handleContinueWorkout}
              className="w-full"
              size="lg"
            >
              <Play className="mr-2 h-5 w-5" />
              Continuar Treino
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Button 
          onClick={() => setShowNewWorkout(true)}
          className="h-14 text-lg"
          size="lg"
        >
          <Plus className="mr-2 h-6 w-6" />
          Iniciar Treino
        </Button>
      )}

      {/* Estatísticas da semana */}
      {weekStats && (
        <section>
          <h2 className="mb-3 text-lg font-semibold">Esta Semana</h2>
          <div className="grid grid-cols-2 gap-3">
            <Card>
              <CardContent className="flex items-center gap-3 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/20 text-blue-500">
                  <Dumbbell className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{weekStats.totalWorkouts}</p>
                  <p className="text-xs text-muted-foreground">Treinos</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="flex items-center gap-3 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/20 text-green-500">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {weekStats.totalVolume >= 1000 
                      ? `${(weekStats.totalVolume / 1000).toFixed(1)}t` 
                      : `${weekStats.totalVolume}kg`
                    }
                  </p>
                  <p className="text-xs text-muted-foreground">Volume Total</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="flex items-center gap-3 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-500/20 text-yellow-500">
                  <Trophy className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{weekStats.totalSets}</p>
                  <p className="text-xs text-muted-foreground">Séries</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="flex items-center gap-3 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-500/20 text-purple-500">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{formatDuration(weekStats.totalTime)}</p>
                  <p className="text-xs text-muted-foreground">Tempo Total</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* Último treino */}
      {lastWorkout && (
        <section>
          <h2 className="mb-3 text-lg font-semibold">Último Treino</h2>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{lastWorkout.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {formatWorkoutDate(lastWorkout.date)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">
                    {calculateWorkoutVolume(lastWorkout).toLocaleString('pt-BR')} kg
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDuration(lastWorkout.duration)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      {/* Rotinas rápidas */}
      {routines.length > 0 && (
        <section>
          <h2 className="mb-3 text-lg font-semibold">Rotinas</h2>
          <div className="space-y-2">
            {routines.slice(0, 3).map(routine => (
              <Card key={routine.id} className="cursor-pointer transition-colors hover:bg-muted/50">
                <CardContent 
                  className="flex items-center justify-between p-4"
                  onClick={() => handleStartFromRoutine(routine)}
                >
                  <div>
                    <h3 className="font-medium">{routine.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {routine.exercises.length} exercícios
                    </p>
                  </div>
                  <Button variant="ghost" size="icon">
                    <Play className="h-5 w-5" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Dialog para novo treino */}
      <Dialog open={showNewWorkout} onOpenChange={setShowNewWorkout}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Treino</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="workout-name">Nome do treino</Label>
              <Input
                id="workout-name"
                placeholder={`Treino ${new Date().toLocaleDateString('pt-BR')}`}
                value={workoutName}
                onChange={e => setWorkoutName(e.target.value)}
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewWorkout(false)}>
              Cancelar
            </Button>
            <Button onClick={handleStartWorkout}>
              <Dumbbell className="mr-2 h-4 w-4" />
              Começar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
