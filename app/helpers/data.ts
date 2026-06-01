import { useEffect, useState } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { useLanguageStore } from '../stores/languageStore'

type EventData = {
  id: number
  title: string
  date: string
  description: string
  category?: string
  location?: { lat: number; lon: number }
  images?: { src: string; alt: string }[]
  quotes?: { text: string; source?: string }[]
  sounds?: { src: string; label?: string }[]
  source?: string
}

const dataImporters: Record<string, () => Promise<{ default: EventData[] }>> = {
  tr: () => import('../json/events_tr.json'),
  en: () => import('../json/events_en.json'),
  de: () => import('../json/events_de.json'),
  es: () => import('../json/events_es.json'),
}

const dataCache: Record<string, EventData[]> = {}

export const useEventsData = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const { currentLanguageCode, setLanguage } = useLanguageStore()

  const urlLanguage = searchParams.get('language')
  const activeLanguage = urlLanguage || currentLanguageCode || 'tr'

  const [data, setData] = useState<EventData[]>(() => dataCache[activeLanguage] || [])

  useEffect(() => {
    if (urlLanguage && urlLanguage !== currentLanguageCode) {
      setLanguage(urlLanguage)
    } else if (!urlLanguage && currentLanguageCode) {
      const params = new URLSearchParams(searchParams.toString())
      params.set('language', currentLanguageCode)
      router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    }
  }, [urlLanguage, currentLanguageCode, setLanguage, router, pathname, searchParams])

  useEffect(() => {
    let cancelled = false

    const loadData = async () => {
      if (dataCache[activeLanguage]) {
        if (!cancelled) {
          setData(dataCache[activeLanguage])
        }
        return
      }

      try {
        const importer = dataImporters[activeLanguage] || dataImporters.tr
        const importedModule = await importer()
        dataCache[activeLanguage] = importedModule.default
        if (!cancelled) {
          setData(importedModule.default)
        }
      } catch (error) {
        console.error(`Failed to load language data for ${activeLanguage}:`, error)
        if (!dataCache.tr) {
          const fallbackModule = await dataImporters.tr()
          dataCache.tr = fallbackModule.default
        }
        if (!cancelled) {
          setData(dataCache.tr)
        }
      }
    }

    loadData()

    return () => {
      cancelled = true
    }
  }, [activeLanguage])

  return data
}
