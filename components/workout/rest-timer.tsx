'use client'

import { useEffect } from 'react'
import { X, Plus, Minus, Play, Pause, SkipForward } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTimer, formatTime } from '@/hooks/use-timer'
import { cn } from '@/lib/utils'

interface RestTimerProps {
  isOpen: boolean
  duration: number
  onClose: () => void
  onFinish?: () => void
}

export function RestTimer({ isOpen, duration, onClose, onFinish }: RestTimerProps) {
  const timer = useTimer(onFinish)
  
  // Inicia o timer quando abre
  useEffect(() => {
    if (isOpen) {
      timer.start(duration)
    }
  }, [isOpen, duration])

  if (!isOpen) return null

  const progress = duration > 0 ? ((duration - timer.seconds) / duration) * 100 : 0

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm">
      <div className="flex w-full max-w-sm flex-col items-center gap-6 p-6">
        {/* Header */}
        <div className="flex w-full items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Descanso</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Timer Circle */}
        <div className="relative flex h-56 w-56 items-center justify-center">
          {/* Background circle */}
          <svg className="absolute h-full w-full -rotate-90">
            <circle
              cx="112"
              cy="112"
              r="100"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-muted"
            />
            <circle
              cx="112"
              cy="112"
              r="100"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={628}
              strokeDashoffset={628 - (628 * progress) / 100}
              className={cn(
                'transition-all duration-1000',
                timer.isFinished ? 'text-green-500' : 'text-primary'
              )}
            />
          </svg>
          
          {/* Time display */}
          <div className="flex flex-col items-center gap-1">
            <span className={cn(
              'text-5xl font-bold tabular-nums',
              timer.isFinished && 'text-green-500'
            )}>
              {formatTime(timer.seconds)}
            </span>
            {timer.isFinished && (
              <span className="text-sm text-green-500">Pronto!</span>
            )}
          </div>
        </div>

        {/* Time adjustment buttons */}
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="lg"
            onClick={() => timer.addTime(-15)}
            disabled={timer.seconds <= 15}
            className="h-12 w-12 rounded-full p-0"
          >
            <Minus className="h-5 w-5" />
          </Button>
          
          <span className="min-w-16 text-center text-sm text-muted-foreground">
            15s
          </span>
          
          <Button
            variant="outline"
            size="lg"
            onClick={() => timer.addTime(15)}
            className="h-12 w-12 rounded-full p-0"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>

        {/* Control buttons */}
        <div className="flex items-center gap-4">
          {timer.isRunning ? (
            <Button
              variant="secondary"
              size="lg"
              onClick={timer.pause}
              className="h-14 w-32"
            >
              <Pause className="mr-2 h-5 w-5" />
              Pausar
            </Button>
          ) : (
            <Button
              variant="secondary"
              size="lg"
              onClick={timer.resume}
              disabled={timer.isFinished || timer.seconds === 0}
              className="h-14 w-32"
            >
              <Play className="mr-2 h-5 w-5" />
              Continuar
            </Button>
          )}
          
          <Button
            variant="default"
            size="lg"
            onClick={() => {
              timer.skip()
              onClose()
            }}
            className="h-14 w-32"
          >
            <SkipForward className="mr-2 h-5 w-5" />
            Pular
          </Button>
        </div>
      </div>
    </div>
  )
}
