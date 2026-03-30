'use client'

import { useState } from 'react'
import { Search, Filter, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'
import { exercises, searchExercises, getExercisesByMuscleGroup } from '@/lib/exercises-data'
import { Exercise, MUSCLE_GROUP_LABELS, EQUIPMENT_LABELS, MuscleGroup, Equipment } from '@/lib/types'
import { cn } from '@/lib/utils'

const muscleGroups: MuscleGroup[] = [
  'peito', 'costas', 'ombros', 'biceps', 'triceps', 
  'pernas', 'gluteos', 'abdomen'
]

const equipmentTypes: Equipment[] = [
  'barra', 'halteres', 'maquina', 'cabo', 'peso-corporal', 'kettlebell'
]

export default function ExercisesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedMuscle, setSelectedMuscle] = useState<MuscleGroup | null>(null)
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null)
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null)

  // Filtra exercícios
  let filteredExercises = exercises

  if (searchQuery) {
    filteredExercises = searchExercises(searchQuery)
  } else if (selectedMuscle) {
    filteredExercises = getExercisesByMuscleGroup(selectedMuscle)
  }

  if (selectedEquipment) {
    filteredExercises = filteredExercises.filter(ex => ex.equipment === selectedEquipment)
  }

  const hasFilters = selectedMuscle || selectedEquipment

  const clearFilters = () => {
    setSelectedMuscle(null)
    setSelectedEquipment(null)
    setSearchQuery('')
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Header */}
      <header className="pt-2">
        <h1 className="text-2xl font-bold">Exercícios</h1>
        <p className="text-muted-foreground">
          {exercises.length} exercícios disponíveis
        </p>
      </header>

      {/* Busca e filtros */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar exercício..."
            value={searchQuery}
            onChange={e => {
              setSearchQuery(e.target.value)
              if (e.target.value) {
                setSelectedMuscle(null)
              }
            }}
            className="pl-9"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
              onClick={() => setSearchQuery('')}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="relative shrink-0">
              <Filter className="h-4 w-4" />
              {hasFilters && (
                <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-primary" />
              )}
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Filtros</SheetTitle>
            </SheetHeader>
            <div className="mt-6 space-y-6">
              {/* Grupo muscular */}
              <div>
                <h3 className="mb-3 text-sm font-medium">Grupo Muscular</h3>
                <div className="flex flex-wrap gap-2">
                  {muscleGroups.map(group => (
                    <Badge
                      key={group}
                      variant={selectedMuscle === group ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => setSelectedMuscle(
                        selectedMuscle === group ? null : group
                      )}
                    >
                      {MUSCLE_GROUP_LABELS[group]}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Equipamento */}
              <div>
                <h3 className="mb-3 text-sm font-medium">Equipamento</h3>
                <div className="flex flex-wrap gap-2">
                  {equipmentTypes.map(equip => (
                    <Badge
                      key={equip}
                      variant={selectedEquipment === equip ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => setSelectedEquipment(
                        selectedEquipment === equip ? null : equip
                      )}
                    >
                      {EQUIPMENT_LABELS[equip]}
                    </Badge>
                  ))}
                </div>
              </div>

              {hasFilters && (
                <Button variant="outline" className="w-full" onClick={clearFilters}>
                  Limpar Filtros
                </Button>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Filtros rápidos por grupo muscular */}
      {!searchQuery && (
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex gap-2 pb-2">
            <Button
              variant={selectedMuscle === null ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedMuscle(null)}
              className="shrink-0"
            >
              Todos
            </Button>
            {muscleGroups.map(group => (
              <Button
                key={group}
                variant={selectedMuscle === group ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedMuscle(group)}
                className="shrink-0"
              >
                {MUSCLE_GROUP_LABELS[group]}
              </Button>
            ))}
          </div>
        </ScrollArea>
      )}

      {/* Contagem de resultados */}
      {(searchQuery || hasFilters) && (
        <p className="text-sm text-muted-foreground">
          {filteredExercises.length} exercício{filteredExercises.length !== 1 ? 's' : ''} encontrado{filteredExercises.length !== 1 ? 's' : ''}
        </p>
      )}

      {/* Lista de exercícios */}
      <div className="grid gap-3">
        {filteredExercises.map(exercise => (
          <Card 
            key={exercise.id}
            className="cursor-pointer transition-colors hover:bg-muted/50"
            onClick={() => setSelectedExercise(exercise)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <h3 className="font-medium leading-tight">{exercise.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {MUSCLE_GROUP_LABELS[exercise.muscleGroup]}
                  </p>
                </div>
                <Badge variant="secondary" className="shrink-0">
                  {EQUIPMENT_LABELS[exercise.equipment]}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredExercises.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">Nenhum exercício encontrado</p>
            {hasFilters && (
              <Button variant="link" onClick={clearFilters} className="mt-2">
                Limpar filtros
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Modal de detalhes do exercício */}
      <Dialog open={!!selectedExercise} onOpenChange={() => setSelectedExercise(null)}>
        <DialogContent className="max-w-md">
          {selectedExercise && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedExercise.name}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge>{MUSCLE_GROUP_LABELS[selectedExercise.muscleGroup]}</Badge>
                  <Badge variant="secondary">
                    {EQUIPMENT_LABELS[selectedExercise.equipment]}
                  </Badge>
                </div>

                <div>
                  <h4 className="mb-3 font-medium">Como executar:</h4>
                  <ol className="space-y-3">
                    {selectedExercise.instructions.map((instruction, index) => (
                      <li key={index} className="flex gap-3">
                        <span className={cn(
                          'flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-medium',
                          'bg-primary/10 text-primary'
                        )}>
                          {index + 1}
                        </span>
                        <span className="text-sm text-muted-foreground leading-relaxed">
                          {instruction}
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
