import React from 'react'
import { cleanup, fireEvent, render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

import GoalTrackerWidget from './GoalTrackerWidget'

describe('<GoalTrackerWidget />', () => {
  const goal = {
    id: '0123456789abcdef01234567',
    name: 'My goal',
    target: 42,
    units: 'wombats',
  }

  describe('when not completed', () => {
    it('should render appropriately', () => {
      for (const progress of [0, 1, 21, 41]) {
        const { getByRole, queryByTestId, queryByText } = render(
          <GoalTrackerWidget goal={goal} progress={progress} />
        )
        expect(getByRole('heading')).toHaveTextContent(goal.name)
        expect(getByRole('progressbar')).toHaveAttribute(
          'aria-valuenow',
          String(Math.round((progress * 100) / goal.target))
        )
        expect(
          queryByText(`${progress} ${goal.units} sur ${goal.target}`)
        ).not.toBeNull()

        expect(queryByTestId('in-progress')).not.toBeNull()

        cleanup()
      }
    })

    it('should trigger its onProgress on click', () => {
      const progress = 21
      const onProgress = jest.fn()
      const { getByRole } = render(
        <GoalTrackerWidget
          goal={goal}
          onProgress={onProgress}
          progress={progress}
        />
      )

      fireEvent.click(getByRole('button'))

      expect(onProgress).toHaveBeenCalledTimes(1)
      expect(onProgress).toHaveBeenCalledWith(goal)
    })

    it('should otherwise match the expected snapshot', () => {
      const { container } = render(
        <GoalTrackerWidget goal={goal} progress={21} />
      )

      expect(container).toMatchSnapshot()
    })
  })

  describe('when completed (or exceeded)', () => {
    it('should render appropriately', () => {
      for (const progress of [goal.target, goal.target + 1, goal.target + 10]) {
        const { queryByTestId } = render(
          <GoalTrackerWidget goal={goal} progress={progress} />
        )

        expect(queryByTestId('in-progress')).toBeNull()
        expect(queryByTestId('completed')).not.toBeNull()

        cleanup()
      }
    })

    it('should otherwise match the expected snapshot', () => {
      const { container } = render(
        <GoalTrackerWidget goal={goal} progress={42} />
      )

      expect(container).toMatchSnapshot()
    })
  })
})
