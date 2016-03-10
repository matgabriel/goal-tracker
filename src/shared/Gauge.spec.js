// Jauge (tests)
// =============

import React from 'react'
import { render } from '@testing-library/react'
// Cet import enregistre des assertions supplémentaires liées à jest-dom dans le
// `expect()` de Jest, telles que `toBeDisabled()`, `toHaveClass()` ou encore
// `toHaveAttribute()`.
import '@testing-library/jest-dom/extend-expect'

import Gauge from './Gauge'

describe('<Gauge />', () => {
  it('should render appropriately', () => {
    const { getByRole } = render(<Gauge value={50} />)
    // On récupère le composant dont le rôle est une barre de progression
    // (défini en interne par le `<LinearProgress/>` au sein de `<Gauge/>`).
    const progressBar = getByRole('progressbar')
    // On vérifie qu’il est bien en mode “determinate” (la barre ne cycle pas)
    expect(progressBar).toHaveClass('MuiLinearProgress-determinate')
    // On vérifie que notre style personnalisé est appliqué.
    expect(progressBar).toHaveAttribute(
      'style',
      expect.stringContaining('height: 8px')
    )
    // On vérifie la valeur normalisée
    expect(progressBar).toHaveAttribute('aria-valuenow', '50')
  })

  it('should normalize value on custom max', () => {
    const { getByRole } = render(<Gauge value={40} max={80} />)
    // On vérifie la valeur normalisée
    expect(getByRole('progressbar')).toHaveAttribute('aria-valuenow', '50')
  })

  it('should otherwise match the expected snapshot', () => {
    const { container } = render(<Gauge value={50} />)

    // On se contente de comparer le rendu à un
    // [*snapshot*](https://jestjs.io/docs/en/snapshot-testing) pris en
    // développement quand le composant fonctionnait comme prévu.
    expect(container).toMatchSnapshot()
  })
})
