'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { getSettings } from '@/lib/storage'

interface UseTimerReturn {
  seconds: number
  isRunning: boolean
  isFinished: boolean
  start: (duration?: number) => void
  pause: () => void
  resume: () => void
  reset: () => void
  skip: () => void
  addTime: (seconds: number) => void
}

export function useTimer(onFinish?: () => void): UseTimerReturn {
  const [seconds, setSeconds] = useState(0)
  const [totalSeconds, setTotalSeconds] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [isFinished, setIsFinished] = useState(false)
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const onFinishRef = useRef(onFinish)
  
  // Mantém a referência do callback atualizada
  useEffect(() => {
    onFinishRef.current = onFinish
  }, [onFinish])

  // Limpa o intervalo quando o componente desmonta
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  // Efeito principal do timer
  useEffect(() => {
    if (isRunning && seconds > 0) {
      intervalRef.current = setInterval(() => {
        setSeconds(prev => {
          if (prev <= 1) {
            setIsRunning(false)
            setIsFinished(true)
            
            // Notificação sonora
            const settings = getSettings()
            if (settings.soundEnabled) {
              playNotificationSound()
            }
            if (settings.vibrationEnabled && navigator.vibrate) {
              navigator.vibrate([200, 100, 200])
            }
            
            onFinishRef.current?.()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning, seconds])

  const start = useCallback((duration?: number) => {
    const settings = getSettings()
    const time = duration ?? settings.defaultRestTime
    setTotalSeconds(time)
    setSeconds(time)
    setIsRunning(true)
    setIsFinished(false)
  }, [])

  const pause = useCallback(() => {
    setIsRunning(false)
  }, [])

  const resume = useCallback(() => {
    if (seconds > 0) {
      setIsRunning(true)
    }
  }, [seconds])

  const reset = useCallback(() => {
    setSeconds(totalSeconds)
    setIsRunning(false)
    setIsFinished(false)
  }, [totalSeconds])

  const skip = useCallback(() => {
    setSeconds(0)
    setIsRunning(false)
    setIsFinished(true)
  }, [])

  const addTime = useCallback((additionalSeconds: number) => {
    setSeconds(prev => prev + additionalSeconds)
    setTotalSeconds(prev => prev + additionalSeconds)
  }, [])

  return {
    seconds,
    isRunning,
    isFinished,
    start,
    pause,
    resume,
    reset,
    skip,
    addTime,
  }
}

// Função para tocar som de notificação
function playNotificationSound() {
  try {
    const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
    
    // Cria um som de beep
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)
    
    oscillator.frequency.value = 800
    oscillator.type = 'sine'
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)
    
    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.5)
    
    // Segundo beep
    setTimeout(() => {
      const osc2 = audioContext.createOscillator()
      const gain2 = audioContext.createGain()
      
      osc2.connect(gain2)
      gain2.connect(audioContext.destination)
      
      osc2.frequency.value = 1000
      osc2.type = 'sine'
      
      gain2.gain.setValueAtTime(0.3, audioContext.currentTime)
      gain2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)
      
      osc2.start(audioContext.currentTime)
      osc2.stop(audioContext.currentTime + 0.5)
    }, 200)
  } catch (e) {
    // Ignora erros de áudio silenciosamente
    console.log('Audio not supported')
  }
}

// Formata segundos para MM:SS
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}
