'use client'

import dynamic from 'next/dynamic'
import { useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useRef } from 'react'
import Header from '@/app/components/header/Header'
import Timeline from '@/app/components/timeline/Timeline'
import Content from '@/app/components/content/Content'
import ActionButtons from '@/app/components/action-buttons/ActionButtons'
import SupportMe from '../support-me/SupportMe'
import GitHubStar from '../github-star/GitHubStar'
import type { EventItem, EventLocation } from '@/app/types'

const About = dynamic(() => import('@/app/components/about/About'), { ssr: false })
const Balloons = dynamic(() => import('@/app/components/ceremonies/widgets/ballons/Balloons'), {
  ssr: false,
})
const Clouds = dynamic(() => import('@/app/components/ceremonies/widgets/clouds/Clouds'), {
  ssr: false,
})
const Ceremonies = dynamic(() => import('@/app/components/ceremonies/Ceremonies'), { ssr: false })
const MapWithNoSSR = dynamic(() => import('@/app/components/map/Map'), { ssr: false })

interface HomeClientProps {
  events: EventItem[]
}

const SECRET_CODE = 'sadeceharita'
const DEFAULT_MAP_LOCATION: EventLocation = { lat: 39.0, lon: 35.0 }

function removeElements() {
  const selectorsByTag = ['header']
  const classKeywords = [
    'Content',
    'ActionButtons',
    'Timeline',
    'GitHubStar',
    'SupportMe',
    'leaflet-control-attribution',
  ]

  selectorsByTag.forEach((tag) => {
    document.querySelectorAll(tag).forEach((el) => el.remove())
  })

  classKeywords.forEach((keyword) => {
    document.querySelectorAll('*').forEach((el) => {
      if (el.classList && el.classList.length > 0) {
        const matches = Array.from(el.classList).some((className) =>
          className.toLowerCase().includes(keyword.toLowerCase()),
        )
        if (matches && document.body.contains(el)) {
          el.remove()
        }
      }
    })
  })
}

export default function HomeClient({ events }: HomeClientProps) {
  const searchParams = useSearchParams()
  const bufferRef = useRef('')

  const currentId = searchParams?.get('id')

  useEffect(() => {
    if (currentId === 'about') return

    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)
        return

      bufferRef.current = (bufferRef.current + event.key).slice(-SECRET_CODE.length)
      if (bufferRef.current === SECRET_CODE) {
        removeElements()
        document.querySelectorAll('path.leaflet-interactive').forEach((el) => {
          ;(el as HTMLElement).style.stroke = 'red'
          ;(el as HTMLElement).style.strokeWidth = '2px'
        })
        bufferRef.current = ''
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentId])

  const selectedEvent = events.find((item) => item.id === Number(currentId)) || events[0]
  const selectedLocation =
    selectedEvent?.location ||
    events.find((item) => item.location)?.location ||
    DEFAULT_MAP_LOCATION

  if (currentId === 'about') {
    return (
      <>
        <Header />
        <Timeline />
        <About />
        <Balloons />
        <GitHubStar />
      </>
    )
  }
  if (currentId !== 'about') {
    return (
      <>
        {currentId !== null && <Clouds />}
        <MapWithNoSSR location={selectedLocation} />
        <Header />
        <Content />
        <ActionButtons />
        <Timeline />
        <Ceremonies />
        <SupportMe />
        <GitHubStar />
      </>
    )
  }
}
