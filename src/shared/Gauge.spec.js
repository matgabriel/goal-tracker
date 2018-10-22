import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

import Gauge from './Gauge'

describe('<Gauge />', () => {
  it('should render appropriately', () => {
    const { getByRole } = render(<Gauge value={50} />)
    const progressBar = getByRole('progressbar')
    expect(progressBar).toHaveClass('MuiLinearProgress-determinate')
    expect(progressBar).toHaveAttribute(
      'style',
      expect.stringContaining('height: 8px')
    )
    expect(progressBar).toHaveAttribute('aria-valuenow', '50')
  })

  it('should normalize value on custom max', () => {
    const { getByRole } = render(<Gauge value={40} max={80} />)
    expect(getByRole('progressbar')).toHaveAttribute('aria-valuenow', '50')
  })

  it('should otherwise match the expected snapshot', () => {
    const { container } = render(<Gauge value={50} />)

    expect(container).toMatchSnapshot()
  })
})
