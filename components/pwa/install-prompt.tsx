"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { X, Download, Share } from "lucide-react"

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)

  useEffect(() => {
    // Check if already installed
    const standalone = window.matchMedia("(display-mode: standalone)").matches
    setIsStandalone(standalone)

    // Check if iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
    setIsIOS(iOS)

    // Listen for install prompt
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      
      // Show prompt after a delay if not dismissed before
      const dismissed = localStorage.getItem("pwa-prompt-dismissed")
      if (!dismissed) {
        setTimeout(() => setShowPrompt(true), 3000)
      }
    }

    window.addEventListener("beforeinstallprompt", handler)

    // Show iOS prompt after delay
    if (iOS && !standalone) {
      const dismissed = localStorage.getItem("pwa-prompt-dismissed")
      if (!dismissed) {
        setTimeout(() => setShowPrompt(true), 3000)
      }
    }

    // Register service worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(console.error)
    }

    return () => window.removeEventListener("beforeinstallprompt", handler)
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === "accepted") {
      setDeferredPrompt(null)
      setShowPrompt(false)
    }
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    localStorage.setItem("pwa-prompt-dismissed", "true")
  }

  if (isStandalone || !showPrompt) return null

  return (
    <div className="fixed bottom-24 left-4 right-4 z-50 animate-in slide-in-from-bottom-4">
      <div className="bg-card border border-border rounded-xl p-4 shadow-lg">
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Download className="h-6 w-6 text-primary" />
          </div>

          <div className="flex-1 pr-6">
            <h3 className="font-semibold text-foreground">
              Instalar TreinoLab
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {isIOS
                ? "Adicione a tela inicial para acesso rapido e uso offline."
                : "Instale o app para acesso rapido e uso offline."}
            </p>

            {isIOS ? (
              <div className="mt-3 text-sm text-muted-foreground">
                <p className="flex items-center gap-2">
                  <Share className="h-4 w-4" />
                  Toque em <strong>Compartilhar</strong> e depois em{" "}
                  <strong>Adicionar a Tela de Inicio</strong>
                </p>
              </div>
            ) : (
              <Button onClick={handleInstall} className="mt-3" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Instalar
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
