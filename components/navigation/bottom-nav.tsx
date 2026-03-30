'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Dumbbell, Library, History, ListChecks, BarChart3 } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  {
    href: '/',
    label: 'Treino',
    icon: Dumbbell,
  },
  {
    href: '/exercicios',
    label: 'Exercícios',
    icon: Library,
  },
  {
    href: '/historico',
    label: 'Histórico',
    icon: History,
  },
  {
    href: '/rotinas',
    label: 'Rotinas',
    icon: ListChecks,
  },
  {
    href: '/estatisticas',
    label: 'Stats',
    icon: BarChart3,
  },
]

export function BottomNav() {
  const pathname = usePathname()

  // Esconde a navegação durante um treino ativo
  const isInWorkout = pathname.startsWith('/treino/')

  if (isInWorkout) return null

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 safe-area-pb">
      <div className="mx-auto flex h-16 max-w-lg items-center justify-around px-2">
        {navItems.map(item => {
          const isActive = pathname === item.href || 
            (item.href !== '/' && pathname.startsWith(item.href))
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center gap-1 rounded-lg px-3 py-2 text-xs font-medium transition-colors',
                isActive 
                  ? 'text-primary' 
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <item.icon 
                className={cn(
                  'h-5 w-5',
                  isActive && 'text-primary'
                )} 
              />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
