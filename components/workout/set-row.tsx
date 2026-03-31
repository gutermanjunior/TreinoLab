'use client'

import { useState, useEffect } from 'react'
import { Check, Trophy, Trash2, MoreVertical, Flame, AlertCircle, Quote } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { WorkoutSet } from '@/lib/types'
import { cn } from '@/lib/utils'

interface SetRowProps {
  set: WorkoutSet
  setNumber: number
  previousWeight?: number
  previousReps?: number
  onComplete: (weight: number, reps: number) => void
  onUpdate: (updates: Partial<WorkoutSet>) => void
  onRemove: () => void
  showRemove: boolean
}

export function SetRow({
  set,
  setNumber,
  previousWeight,
  previousReps,
  onComplete,
  onUpdate,
  onRemove,
  showRemove,
}: SetRowProps) {
  const [weight, setWeight] = useState(set.weight.toString())
  const [reps, setReps] = useState(set.reps.toString())

  // Atualiza os inputs quando o set muda
  useEffect(() => {
    setWeight(set.weight === 0 ? '' : set.weight.toString())
    setReps(set.reps === 0 ? '' : set.reps.toString())
  }, [set.weight, set.reps])

  const handleComplete = () => {
    const weightNum = parseFloat(weight) || 0
    const repsNum = parseInt(reps) || 0
    
    if (weightNum > 0 && repsNum > 0) {
      onComplete(weightNum, repsNum)
    }
  }

  const handleWeightChange = (value: string) => {
    // Permite números e ponto decimal
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setWeight(value)
      onUpdate({ weight: parseFloat(value) || 0 })
    }
  }

  const handleRepsChange = (value: string) => {
    // Apenas números inteiros
    if (value === '' || /^\d*$/.test(value)) {
      setReps(value)
      onUpdate({ reps: parseInt(value) || 0 })
    }
  }

  const toggleWarmup = () => onUpdate({ isWarmup: !set.isWarmup, isFail: false })
  const toggleFail = () => onUpdate({ isFail: !set.isFail, isWarmup: false })
  const toggleMax = () => onUpdate({ isMax: !set.isMax })
  
  const handleNotes = () => {
    const text = window.prompt('Adicionar um comentário para a série:', set.notes || '')
    if (text !== null) {
      onUpdate({ notes: text })
    }
  }

  const canComplete = (parseFloat(weight) || 0) > 0 && (parseInt(reps) || 0) > 0

  return (
    <div className={cn(
      'flex items-center gap-2 rounded-lg p-2 transition-colors',
      set.completed && 'bg-muted/50'
    )}>
      {/* Número da série ou Icone Especial */}
      <div className={cn(
        'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-medium',
        set.completed 
          ? 'bg-primary text-primary-foreground' 
          : set.isWarmup
            ? 'bg-orange-500/20 text-orange-500'
            : set.isFail
              ? 'bg-red-500/20 text-red-500'
              : 'bg-muted text-muted-foreground'
      )}>
        {set.completed ? (
          <Check className="h-4 w-4" />
        ) : set.isWarmup ? (
          <Flame className="h-4 w-4" />
        ) : set.isFail ? (
          <AlertCircle className="h-4 w-4" />
        ) : (
          setNumber
        )}
      </div>

      {/* Série anterior (placeholder) */}
      <div className="hidden w-20 shrink-0 text-center text-xs text-muted-foreground sm:block">
        {previousWeight && previousReps ? (
          `${previousWeight}kg × ${previousReps}`
        ) : (
          '-'
        )}
      </div>

      {/* Input de peso */}
      <div className="relative flex-1">
        <Input
          type="text"
          inputMode="decimal"
          placeholder="0"
          value={weight}
          onChange={e => handleWeightChange(e.target.value)}
          disabled={set.completed}
          className={cn(
            'h-10 pr-8 text-center text-base',
            set.completed && 'bg-muted'
          )}
        />
        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
          kg
        </span>
      </div>

      {/* Input de repetições */}
      <div className="relative flex-1">
        <Input
          type="text"
          inputMode="numeric"
          placeholder="0"
          value={reps}
          onChange={e => handleRepsChange(e.target.value)}
          disabled={set.completed}
          className={cn(
            'h-10 pr-10 text-center text-base',
            set.completed && 'bg-muted'
          )}
        />
        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
          reps
        </span>
      </div>

      {/* Botão de completar ou badge de PR */}
      {set.isPersonalRecord ? (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-yellow-500/20 text-yellow-500">
          <Trophy className="h-5 w-5" />
        </div>
      ) : set.completed ? (
        <div className="w-10 shrink-0" />
      ) : (
        <Button
          variant="default"
          size="icon"
          onClick={handleComplete}
          disabled={!canComplete}
          className="h-10 w-10 shrink-0"
        >
          <Check className="h-5 w-5" />
        </Button>
      )}

      {/* Botões extras / Dropdown */}
      {!set.completed && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-10 w-10 shrink-0">
              <MoreVertical className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuCheckboxItem
              checked={set.isWarmup}
              onCheckedChange={toggleWarmup}
            >
              <Flame className="mr-2 h-4 w-4 text-orange-500" />
              Série de Aquecimento
            </DropdownMenuCheckboxItem>
            
            <DropdownMenuCheckboxItem
              checked={set.isFail}
              onCheckedChange={toggleFail}
            >
              <AlertCircle className="mr-2 h-4 w-4 text-red-500" />
              Série até a Falha
            </DropdownMenuCheckboxItem>

            <DropdownMenuCheckboxItem
              checked={set.isMax}
              onCheckedChange={toggleMax}
            >
              <Trophy className="mr-2 h-4 w-4 text-yellow-500" />
              Tentativa de PR (Max)
            </DropdownMenuCheckboxItem>

            <DropdownMenuSeparator />
            
            <DropdownMenuItem onClick={handleNotes}>
              <Quote className="mr-2 h-4 w-4" />
              {set.notes ? 'Editar Comentário' : 'Adicionar Comentário'}
            </DropdownMenuItem>

            {showRemove && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onRemove} className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Deletar Série
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  )
}
