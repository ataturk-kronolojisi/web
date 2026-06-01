'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  DEFAULT_LANGUAGE_CODE,
  availableLanguages as sharedAvailableLanguages,
  getLanguageFile,
  normalizeLanguageCode,
  type LanguageCode,
  type LocaleData,
} from '../lib/languages'

export const availableLanguages = sharedAvailableLanguages

// Tarayıcı dilini getiren fonksiyon
const getBrowserLanguage = (): string => {
  if (typeof window === 'undefined') return 'tr'

  const browserLang =
    navigator.language || (navigator as Navigator & { userLanguage?: string }).userLanguage || 'tr'
  const langCode = browserLang.split('-')[0].toLowerCase()

  // Desteklenen diller arasında yoksa tr kullanılsın
  const isSupported = sharedAvailableLanguages.some((lang) => lang.code === langCode)
  return isSupported ? langCode : 'tr'
}

interface LanguageStore {
  currentLanguageCode: LanguageCode
  t: LocaleData
  setLanguage: (code: string) => void
}

export const useLanguageStore = create<LanguageStore>()(
  persist(
    (set) => ({
      currentLanguageCode: DEFAULT_LANGUAGE_CODE,
      t: getLanguageFile(DEFAULT_LANGUAGE_CODE),

      setLanguage: (code: string) => {
        const nextLanguageCode = normalizeLanguageCode(code)
        set({
          currentLanguageCode: nextLanguageCode,
          t: getLanguageFile(nextLanguageCode),
        })
      },
    }),
    {
      name: 'language-storage',
      // Sadece dil kodunu localStorage'a kaydet, t değerini kaydetme
      partialize: (state) => ({ currentLanguageCode: state.currentLanguageCode }),
      // localStorage'tan okurken t dinamik olarak hesaplansın
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.t = getLanguageFile(state.currentLanguageCode)
        }
      },
    },
  ),
)

// Hydration sonrası ilk ziyaret kontrolü (istemci tarafında)
if (typeof window !== 'undefined') {
  const checkAndSetInitialLanguage = () => {
    // Öncelik sırası: URL parametresi > localStorage > Tarayıcı dili > tr
    const urlParams = new URLSearchParams(window.location.search)
    const urlLanguage = urlParams.get('language')
    const stored = localStorage.getItem('language-storage')

    // 1. URL parametresi varsa onu kullan
    if (urlLanguage) {
      useLanguageStore.getState().setLanguage(urlLanguage)
    } else if (!stored) {
      const browserLang = getBrowserLanguage()
      useLanguageStore.getState().setLanguage(browserLang)
    }
  }

  // Store hydration tamamlandıktan sonra çalıştır
  setTimeout(checkAndSetInitialLanguage, 0)
}
