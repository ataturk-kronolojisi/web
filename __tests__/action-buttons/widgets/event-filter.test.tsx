// @vitest-environment jsdom

import { describe, it, expect } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import '../test-utils'
import { mockRouterReplace } from '../test-utils'
import EventFilter from '@/app/components/action-buttons/widgets/event-filter/EventFilter'

describe('EventFilter', () => {
  it('filtre panelini acar ve secilen filtreyi URLye yazar', () => {
    render(<EventFilter />)

    fireEvent.click(screen.getByTitle('Filtreyi Ac'))
    fireEvent.click(screen.getByTitle('Kisisel'))

    expect(mockRouterReplace).toHaveBeenCalledWith(
      expect.stringContaining('displayed-locations=personal'),
      { scroll: false }
    )
  })

  it('disariya tiklaninca filtre panelini kapatir', () => {
    render(<EventFilter />)

    fireEvent.click(screen.getByTitle('Filtreyi Ac'))
    expect(screen.getByTitle('Kisisel')).toBeInTheDocument()

    fireEvent.mouseDown(document.body)
    expect(screen.queryByTitle('Kisisel')).not.toBeInTheDocument()
  })
})
