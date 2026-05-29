import { describe, it, expect } from 'vitest'
import {
  getQuotes,
  resolveQuotes,
  buildPermalink,
  mapToPublicQuote,
  MAX_QUOTES_PER_REQUEST,
  DEFAULT_BASE_URL,
} from '@/app/helpers/quotes'

describe('quotes helpers', () => {
  const TEST_BASE_URL = 'https://ataturk-kronolojisi.org'

  describe('getQuotes', () => {
    it('Türkçe alıntıları getirmeli', () => {
      const quotes = getQuotes('tr')
      expect(Array.isArray(quotes)).toBe(true)
      expect(quotes.length).toBeGreaterThan(0)
    })

    it('İngilizce alıntıları getirmeli', () => {
      const quotes = getQuotes('en')
      expect(Array.isArray(quotes)).toBe(true)
      expect(quotes.length).toBeGreaterThan(0)
    })

    it('her alıntı gerekli alanlara sahip olmalı', () => {
      const quotes = getQuotes('tr')
      const quote = quotes[0]
      expect(quote).toHaveProperty('id')
      expect(quote).toHaveProperty('eventId')
      expect(quote).toHaveProperty('date')
      expect(quote).toHaveProperty('title')
      expect(quote).toHaveProperty('quote')
      expect(quote).toHaveProperty('language')
    })

    it('geçersiz dil için Türkçe alıntıları döndürmeli', () => {
      // @ts-expect-error Testing invalid language
      const quotes = getQuotes('invalid')
      expect(Array.isArray(quotes)).toBe(true)
    })
  })

  describe('resolveQuotes', () => {
    it('varsayılan olarak tek bir alıntı döndürmeli', () => {
      const quotes = resolveQuotes('tr')
      expect(quotes).toHaveLength(1)
    })

    it('random=true ile rastgele alıntılar getirmeli', () => {
      const quotes = resolveQuotes('tr', { random: true, count: 5 })
      expect(quotes.length).toBeLessThanOrEqual(5)
    })

    it('eventId ile filtreleme yapmalı', () => {
      const allQuotes = getQuotes('tr')
      const firstEventId = allQuotes[0].eventId
      const filtered = resolveQuotes('tr', { eventId: firstEventId })
      filtered.forEach((q) => {
        expect(q.eventId).toBe(firstEventId)
      })
    })

    it('quoteId ile filtreleme yapmalı', () => {
      const allQuotes = getQuotes('tr')
      const firstQuoteId = allQuotes[0].id
      const filtered = resolveQuotes('tr', { quoteId: firstQuoteId })
      expect(filtered).toHaveLength(1)
      expect(filtered[0].id).toBe(firstQuoteId)
    })

    it('count sınırlaması yapmalı', () => {
      const quotes = resolveQuotes('tr', { count: 3 })
      expect(quotes.length).toBeLessThanOrEqual(3)
    })

    it('MAX_QUOTES_PER_REQUEST kadar döndürmeli', () => {
      const quotes = resolveQuotes('tr', { count: 100 })
      expect(quotes.length).toBeLessThanOrEqual(MAX_QUOTES_PER_REQUEST)
    })
  })

  describe('buildPermalink', () => {
    it('dogru URL formati olusturmali', () => {
      const permalink = buildPermalink(1, 'tr', TEST_BASE_URL)
      expect(permalink).toContain('id=1')
      expect(permalink).toContain('language=tr')
      expect(permalink).toContain(TEST_BASE_URL)
    })

    it('ozel baseUrl kullanmali', () => {
      const permalink = buildPermalink(5, 'en', 'https://example.com')
      expect(permalink).toContain('https://example.com')
      expect(permalink).toContain('id=5')
      expect(permalink).toContain('language=en')
    })
  })

  describe('mapToPublicQuote', () => {
    it("QuoteRecord'u PublicQuote'a donusturmeli", () => {
      const quotes = getQuotes('tr')
      const publicQuote = mapToPublicQuote(quotes[0], 'tr', TEST_BASE_URL)

      expect(publicQuote).toHaveProperty('id')
      expect(publicQuote).toHaveProperty('text')
      expect(publicQuote).toHaveProperty('eventId')
      expect(publicQuote).toHaveProperty('eventTitle')
      expect(publicQuote).toHaveProperty('date')
      expect(publicQuote).toHaveProperty('permalink')
      expect(publicQuote.permalink).toContain('id=')
    })
  })
})
