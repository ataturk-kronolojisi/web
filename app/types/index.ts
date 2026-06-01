export type LanguageCode = 'tr' | 'en' | 'de' | 'es'

export type EventLocation = {
  lat: number
  lon: number
}

export type EventImage = {
  url: string
  alt: string
  source?: string
}

export type QuoteType = {
  text: string
  source?: string
}

export type QuoteLike = string | { text?: string; '-text'?: string; source?: string }

export type EventSound = {
  url: string
  alt: string
  source?: string
}

export type EventItem = {
  id: number
  date: string
  title: string
  description?: string
  category?: string
  location?: EventLocation
  images?: EventImage[] | null
  quotes?: QuoteType[] | null
  sounds?: EventSound[] | null
  source?: string
}

export type AttemptResult = {
  attempt: number
  results: { cardId: number; position: number; isCorrect: boolean }[]
}

export type LanguageOption = {
  code: string
  name: string
}
