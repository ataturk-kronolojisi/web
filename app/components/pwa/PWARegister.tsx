'use client'

import { useEffect } from 'react'

export default function PWARegister() {
  useEffect(() => {
    const isProduction = process.env.NODE_ENV === 'production'
    const enableDevSW = process.env.NEXT_PUBLIC_ENABLE_SW_DEV === 'true'

    if (!isProduction && !enableDevSW) {
      return
    }

    if (!('serviceWorker' in navigator)) {
      return
    }

    const registerServiceWorker = async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
        })

        if (registration.waiting) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' })
        }

        if (!isProduction) {
          console.log('[PWA] Service Worker registered in development mode')
        }
      } catch (error) {
        console.error('Service worker registration failed:', error)
      }
    }

    window.addEventListener('load', registerServiceWorker)

    return () => {
      window.removeEventListener('load', registerServiceWorker)
    }
  }, [])

  return null
}
