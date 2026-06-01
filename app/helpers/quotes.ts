import {
  getEventsData,
  normalizeLanguageCode,
  SUPPORTED_LANGUAGE_CODES,
  type LanguageCode,
  type RawEventImage,
  type RawQuote,
} from '../lib/languages'

export type Language = LanguageCode

export type QuoteRecord = {
  id: string
  eventId: number
  date: string
  title: string
  description?: string
  quote: string
  source?: string
  language: Language
  eventCategory?: string
  image?: RawEventImage | null
}

export type QuoteQuery = {
  quoteId?: string | null
  eventId?: number | null
  date?: string | null
  random?: boolean
  count?: number
}

export const MAX_QUOTES_PER_REQUEST = 10
export const DEFAULT_BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || process.env.BASE_URL || 'https://ataturk-kronolojisi.org'

type FlexibleQuote = RawQuote

function buildQuoteDataset(language: Language): QuoteRecord[] {
  const dataset = getEventsData(language)

  return dataset.flatMap((event) => {
    const rawQuotes = event.quotes ?? []
    const quotesArray = (Array.isArray(rawQuotes) ? rawQuotes : [rawQuotes]) as FlexibleQuote[]

    return quotesArray.map((quote, index) => {
      const isString = typeof quote === 'string'
      const quoteText = isString ? quote : (quote?.text ?? quote?.['-text'] ?? '')
      const quoteSource = isString ? undefined : quote?.source

      return {
        id: `${event.id}-${index}`,
        eventId: event.id,
        date: event.date,
        title: event.title,
        description: event.description,
        quote: quoteText,
        source: quoteSource,
        language,
        eventCategory: event.category,
        image: event.images?.[0] ?? null,
      }
    })
  })
}

const quoteCache = Object.fromEntries(
  SUPPORTED_LANGUAGE_CODES.map((language) => [language, buildQuoteDataset(language)]),
) as Record<Language, QuoteRecord[]>

export const getQuotes = (language: Language): QuoteRecord[] => {
  const normalizedLanguage = normalizeLanguageCode(language)
  return quoteCache[normalizedLanguage] || quoteCache.tr
}

const clampCount = (count?: number | null) => {
  if (!count || Number.isNaN(count)) return 1
  return Math.min(MAX_QUOTES_PER_REQUEST, Math.max(1, count))
}

const pickRandomSubset = (source: QuoteRecord[], count: number) => {
  if (!source.length) return []
  const copy = [...source]
  const output: QuoteRecord[] = []
  for (let i = 0; i < count; i += 1) {
    if (!copy.length) break
    const randomIndex = Math.floor(Math.random() * copy.length)
    output.push(copy[randomIndex])
    copy.splice(randomIndex, 1)
  }
  return output
}

export const resolveQuotes = (language: Language, query: QuoteQuery = {}) => {
  const dataset = getQuotes(language)
  const { quoteId, eventId, date, random } = query

  let filtered = dataset

  if (quoteId) {
    filtered = dataset.filter((quote) => quote.id === quoteId)
  } else if (eventId) {
    filtered = dataset.filter((quote) => quote.eventId === eventId)
  } else if (date) {
    filtered = dataset.filter((quote) => quote.date.startsWith(date))
  }

  if (!filtered.length) {
    filtered = dataset
  }

  const count = clampCount(query.count)

  if (random) {
    return pickRandomSubset(filtered, count)
  }

  return filtered.slice(0, count)
}

export const buildPermalink = (eventId: number, language: Language, baseUrl = DEFAULT_BASE_URL) => {
  const url = new URL(baseUrl)
  url.pathname = '/'
  url.searchParams.set('id', eventId.toString())
  url.searchParams.set('language', language)
  return url.toString()
}

export type PublicQuote = {
  id: string
  text: string
  source?: string
  eventId: number
  eventTitle: string
  eventDescription?: string
  date: string
  category?: string
  image?: RawEventImage | null
  permalink: string
}

export const mapToPublicQuote = (
  quote: QuoteRecord,
  language: Language,
  baseUrl = DEFAULT_BASE_URL,
): PublicQuote => ({
  id: quote.id,
  text: quote.quote,
  source: quote.source,
  eventId: quote.eventId,
  eventTitle: quote.title,
  eventDescription: quote.description,
  date: quote.date,
  category: quote.eventCategory,
  image: quote.image ?? null,
  permalink: buildPermalink(quote.eventId, language, baseUrl),
})
