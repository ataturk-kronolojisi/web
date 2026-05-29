import { describe, it, expect } from 'vitest'
import type {
  LanguageCode,
  EventLocation,
  EventImage,
  QuoteType,
  QuoteLike,
  EventSound,
  EventItem,
  AttemptResult,
  LanguageOption,
} from '@/app/types'

describe('Types', () => {
  describe('LanguageCode', () => {
    it('desteklenen dil kodlarını içermeli', () => {
      const validLanguages: LanguageCode[] = ['tr', 'en', 'de', 'es']
      expect(validLanguages).toHaveLength(4)
      validLanguages.forEach((lang) => {
        expect(['tr', 'en', 'de', 'es']).toContain(lang)
      })
    })
  })

  describe('EventLocation', () => {
    it('lat ve lon alanlarına sahip olmalı', () => {
      const location: EventLocation = { lat: 39.9334, lon: 32.8597 }
      expect(location.lat).toBeTypeOf('number')
      expect(location.lon).toBeTypeOf('number')
    })
  })

  describe('EventImage', () => {
    it('url ve alt alanlarına sahip olmalı', () => {
      const image: EventImage = { url: '/test.jpg', alt: 'Test görseli' }
      expect(image.url).toBeTypeOf('string')
      expect(image.alt).toBeTypeOf('string')
      expect(image.source).toBeUndefined()
    })

    it('source alanı opsiyonel olmalı', () => {
      const imageWithSource: EventImage = {
        url: '/test.jpg',
        alt: 'Test',
        source: 'Kaynak',
      }
      expect(imageWithSource.source).toBe('Kaynak')
    })
  })

  describe('QuoteType', () => {
    it('text alanına sahip olmalı', () => {
      const quote: QuoteType = { text: 'Test sözü' }
      expect(quote.text).toBe('Test sözü')
      expect(quote.source).toBeUndefined()
    })
  })

  describe('QuoteLike', () => {
    it('string veya object olmalı', () => {
      const stringQuote: QuoteLike = 'Basit söz'
      const objectQuote: QuoteLike = { text: 'Nesne sözü', source: 'Kaynak' }

      expect(typeof stringQuote).toBe('string')
      expect(objectQuote).toHaveProperty('text')
    })
  })

  describe('EventItem', () => {
    it('zorunlu alanlara sahip olmalı', () => {
      const event: EventItem = {
        id: 1,
        date: '1881-05-19T00:00:00Z',
        title: 'Doğum',
      }
      expect(event.id).toBe(1)
      expect(event.date).toBe('1881-05-19T00:00:00Z')
      expect(event.title).toBe('Doğum')
    })

    it('opsiyonel alanlar içerebilmeli', () => {
      const event: EventItem = {
        id: 1,
        date: '1881-05-19T00:00:00Z',
        title: 'Doğum',
        description: 'Selanikte doğdu',
        category: 'personal',
        location: { lat: 40.5, lon: 22.9 },
        images: [{ url: '/img.jpg', alt: 'Ev' }],
        quotes: [{ text: 'Güzel söz' }],
        sounds: [{ url: '/sound.mp3', alt: 'Ses' }],
        source: 'https://example.com',
      }
      expect(event.description).toBe('Selanikte doğdu')
      expect(event.category).toBe('personal')
      expect(event.location).toEqual({ lat: 40.5, lon: 22.9 })
    })
  })

  describe('AttemptResult', () => {
    it('attempt ve results alanlarına sahip olmalı', () => {
      const result: AttemptResult = {
        attempt: 1,
        results: [
          { cardId: 1, position: 0, isCorrect: true },
          { cardId: 2, position: 1, isCorrect: false },
        ],
      }
      expect(result.attempt).toBe(1)
      expect(result.results).toHaveLength(2)
      expect(result.results[0].isCorrect).toBe(true)
    })
  })

  describe('LanguageOption', () => {
    it('code ve name alanlarına sahip olmalı', () => {
      const lang: LanguageOption = { code: 'tr', name: 'Türkçe' }
      expect(lang.code).toBe('tr')
      expect(lang.name).toBe('Türkçe')
    })
  })
})
