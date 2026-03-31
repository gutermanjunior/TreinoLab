'use client'

import { useEffect, useState } from 'react'
import { Trophy, TrendingUp, Dumbbell, Calendar, Award } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Empty, EmptyMedia, EmptyTitle, EmptyDescription } from '@/components/ui/empty'
import {
  getWorkouts,
  getPersonalRecords,
  getWeekStats,
  formatDuration,
} from '@/lib/storage'
import { getExerciseById } from '@/lib/exercises-data'
import { Workout, PersonalRecord, WeekStats, MUSCLE_GROUP_LABELS } from '@/lib/types'

export default function StatsPage() {
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [personalRecords, setPersonalRecords] = useState<PersonalRecord[]>([])
  const [weekStats, setWeekStats] = useState<WeekStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setWorkouts(getWorkouts().filter(w => w.completed))
    setPersonalRecords(getPersonalRecords())
    setWeekStats(getWeekStats())
    setIsLoading(false)
  }, [])

  // Agrupa PRs por exercício (pega apenas o melhor de cada)
  const bestPRsByExercise = personalRecords.reduce((acc, pr) => {
    const existing = acc.get(pr.exerciseId)
    if (!existing || pr.weight > existing.weight ||
      (pr.weight === existing.weight && pr.reps > existing.reps)) {
      acc.set(pr.exerciseId, pr)
    }
    return acc
  }, new Map<string, PersonalRecord>())

  const sortedPRs = Array.from(bestPRsByExercise.values())
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  // Estatísticas do mês
  const thisMonth = new Date()
  thisMonth.setDate(1)
  thisMonth.setHours(0, 0, 0, 0)

  const monthWorkouts = workouts.filter(w => new Date(w.date) >= thisMonth)
  const monthVolume = monthWorkouts.reduce((acc, w) => {
    return acc + w.exercises.reduce((exAcc, ex) => {
      return exAcc + ex.sets.reduce((setAcc, set) => {
        return setAcc + (set.completed ? set.weight * set.reps : 0)
      }, 0)
    }, 0)
  }, 0)

  // PRs por grupo muscular
  const prsByMuscle = sortedPRs.reduce((acc, pr) => {
    const exercise = getExerciseById(pr.exerciseId)
    if (exercise) {
      if (!acc[exercise.muscleGroup]) {
        acc[exercise.muscleGroup] = []
      }
      acc[exercise.muscleGroup].push(pr)
    }
    return acc
  }, {} as Record<string, PersonalRecord[]>)

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
        <h1 className="text-2xl font-bold">Estatísticas</h1>
        <p className="text-muted-foreground">
          Acompanhe seu progresso
        </p>
      </header>

      {/* Cards de resumo */}
      <div className="grid grid-cols-2 gap-3">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/20 text-blue-500">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{monthWorkouts.length}</p>
              <p className="text-xs text-muted-foreground">Treinos este mês</p>
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
                {monthVolume >= 1000
                  ? `${(monthVolume / 1000).toFixed(1)}t`
                  : `${monthVolume}kg`
                }
              </p>
              <p className="text-xs text-muted-foreground">Volume mensal</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-500/20 text-yellow-500">
              <Trophy className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{sortedPRs.length}</p>
              <p className="text-xs text-muted-foreground">Recordes pessoais</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-500/20 text-purple-500">
              <Dumbbell className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{workouts.length}</p>
              <p className="text-xs text-muted-foreground">Total de treinos</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs de conteúdo */}
      <Tabs defaultValue="prs" className="mt-2">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="prs">Recordes Pessoais</TabsTrigger>
          <TabsTrigger value="semana">Esta Semana</TabsTrigger>
        </TabsList>

        <TabsContent value="prs" className="mt-4">
          {sortedPRs.length === 0 ? (
            <Empty className="py-12">
              <EmptyMedia>
                <Trophy className="h-10 w-10" />
              </EmptyMedia>
              <EmptyTitle>Nenhum recorde ainda</EmptyTitle>
              <EmptyDescription>
                Complete seus treinos para registrar seus PRs
              </EmptyDescription>
            </Empty>
          ) : (
            <div className="space-y-4">
              {Object.entries(prsByMuscle).map(([muscleGroup, prs]) => (
                <Card key={muscleGroup}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      {MUSCLE_GROUP_LABELS[muscleGroup as keyof typeof MUSCLE_GROUP_LABELS]}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {prs.map(pr => {
                      const exercise = getExerciseById(pr.exerciseId)
                      if (!exercise) return null

                      return (
                        <div
                          key={pr.id}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500/20 text-yellow-500">
                              <Award className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">{exercise.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(pr.date).toLocaleDateString('pt-BR')}
                              </p>
                            </div>
                          </div>
                          <Badge className="bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30">
                            {pr.weight}kg × {pr.reps}
                          </Badge>
                        </div>
                      )
                    })}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="semana" className="mt-4">
          {weekStats && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Resumo Semanal</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Treinos</span>
                    <span className="font-semibold">{weekStats.totalWorkouts}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Volume total</span>
                    <span className="font-semibold">
                      {weekStats.totalVolume.toLocaleString('pt-BR')} kg
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Séries completadas</span>
                    <span className="font-semibold">{weekStats.totalSets}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Tempo total</span>
                    <span className="font-semibold">{formatDuration(weekStats.totalTime)}</span>
                  </div>
                </CardContent>
              </Card>

              {weekStats.totalWorkouts > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Média por Treino</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Volume médio</span>
                      <span className="font-semibold">
                        {Math.round(weekStats.totalVolume / weekStats.totalWorkouts).toLocaleString('pt-BR')} kg
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Séries por treino</span>
                      <span className="font-semibold">
                        {Math.round(weekStats.totalSets / weekStats.totalWorkouts)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Duração média</span>
                      <span className="font-semibold">
                        {formatDuration(Math.round(weekStats.totalTime / weekStats.totalWorkouts))}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
