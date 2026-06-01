import tr from '../locale/tr.json'
import en from '../locale/en.json'
import de from '../locale/de.json'
import es from '../locale/es.json'
import sv from '../locale/sv.json'
import eventsTr from '../json/events_tr.json'
import eventsEn from '../json/events_en.json'
import eventsDe from '../json/events_de.json'
import eventsEs from '../json/events_es.json'
import eventsSv from '../json/events_sv.json'

export type LocaleData = typeof tr

export type RawQuote = string | { text?: string; '-text'?: string; source?: string }

export type RawEventImage = {
  url: string
  alt: string
  source: string
}

export type RawEventSound = {
  url: string
  alt: string
  source?: string
}

export type RawEventLocation = {
  lat: number
  lon: number
}

export type RawEventQuote = {
  text: string
  source?: string
}

export type RawEvent = {
  id: number
  date: string
  title: string
  description?: string
  source?: string
  location?: RawEventLocation | null
  quotes?: RawEventQuote[] | null
  images?: RawEventImage[] | null
  sounds?: RawEventSound[] | null
  category?: string
}

type LanguageDefinition = {
  code: 'tr' | 'en' | 'de' | 'es' | 'sv'
  name: string
  locale: string
  file: LocaleData
  events: RawEvent[]
}

const LANGUAGE_DEFINITIONS: readonly LanguageDefinition[] = [
  {
    code: 'tr',
    name: 'Türkçe',
    locale: 'tr-TR',
    file: tr,
    events: eventsTr as RawEvent[],
  },
  {
    code: 'en',
    name: 'English',
    locale: 'en-US',
    file: en,
    events: eventsEn as RawEvent[],
  },
  {
    code: 'de',
    name: 'Deutsch',
    locale: 'de-DE',
    file: de,
    events: eventsDe as RawEvent[],
  },
  {
    code: 'es',
    name: 'Español',
    locale: 'es-ES',
    file: es,
    events: eventsEs as RawEvent[],
  },
  {
    code: 'sv',
    name: 'Svenska',
    locale: 'sv-SE',
    file: sv,
    events: eventsSv as RawEvent[],
  },
] as const

export type LanguageCode = (typeof LANGUAGE_DEFINITIONS)[number]['code']

const LANGUAGE_MAP = new Map<LanguageCode, LanguageDefinition>(
  LANGUAGE_DEFINITIONS.map((language) => [language.code, language]),
)

export const DEFAULT_LANGUAGE_CODE: LanguageCode = 'tr'

export const SUPPORTED_LANGUAGE_CODES = LANGUAGE_DEFINITIONS.map(
  (language) => language.code,
) as LanguageCode[]

export const supportedLanguages = [...LANGUAGE_DEFINITIONS]

export const availableLanguages = LANGUAGE_DEFINITIONS.map(({ code, name, file }) => ({
  code,
  name,
  file,
}))

export const isSupportedLanguageCode = (code: string): code is LanguageCode => {
  return LANGUAGE_MAP.has(code as LanguageCode)
}

export const normalizeLanguageCode = (code?: string | null): LanguageCode => {
  if (!code) return DEFAULT_LANGUAGE_CODE

  const normalized = code.toLowerCase().split('-')[0]
  return isSupportedLanguageCode(normalized) ? normalized : DEFAULT_LANGUAGE_CODE
}

export const getLanguageConfig = (code?: string | null) => {
  return LANGUAGE_MAP.get(normalizeLanguageCode(code)) ?? LANGUAGE_MAP.get(DEFAULT_LANGUAGE_CODE)
}

export const getLanguageFile = (code?: string | null): LocaleData => {
  return getLanguageConfig(code)?.file ?? tr
}

export const getLocaleForLanguage = (code?: string | null): string => {
  return getLanguageConfig(code)?.locale ?? 'tr-TR'
}

export const getEventsData = (code?: string | null): RawEvent[] => {
  return getLanguageConfig(code)?.events ?? (eventsTr as RawEvent[])
}
