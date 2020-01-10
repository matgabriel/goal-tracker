import reducer, { addGoal, removeGoal, updateGoal } from './goals'

describe('Goals reducer', () => {
  it('should return its initial state', () => {
    const initialState = undefined
    const expectedState = []

    expect(reducer(initialState, {})).toEqual(expectedState)
  })

  it('should handle goal addition', () => {
    const name = 'Test reducers'
    const target = 42
    const units = 'tests'
    const initialState = undefined
    const goals = reducer(initialState, addGoal(name, target, units))

    const REGEX_BSONID = /^[0-9a-f]{24}$/

    // Est-il bien là ?
    expect(goals).toHaveLength(1)
    // A-t-il une bonne tête ?
    expect(goals[0]).toEqual({
      name,
      target,
      units,
      id: expect.stringMatching(REGEX_BSONID),
    })

    // Un ajout supplémentaire préserve-t-il les objectifs existants ?
    const nextGoals = reducer(goals, addGoal(name, target, units))

    expect(nextGoals).toHaveLength(2)
    expect(nextGoals[0]).toEqual(goals[0])

    // Les IDs produits sont-ils alors bien uniques ?
    expect(nextGoals[1]).toHaveProperty(
      'id',
      expect.stringMatching(REGEX_BSONID)
    )
    expect(nextGoals[1].id).not.toBe(nextGoals[0].id)
  })

  it('should handle goal removal', () => {
    const initialState = [{ id: 0 }, { id: 1 }, { id: 2 }]
    const expectedState = [{ id: 0 }, { id: 2 }]

    // Le retrait d’un objectif présent marche-t-il bien ?
    expect(reducer(initialState, removeGoal(1))).toEqual(expectedState)

    // Le retrait d’un objectif manquant préserve-t-il bien l'état ?
    expect(reducer(initialState, removeGoal(42))).toEqual(initialState)
  })

  it('should handle goal update (when in goals)', () => {
    const id = 1
    const name = 'Test reducer 3'
    const target = 42
    const units = 'wombats'
    const initialState = [
      { id: 0, name: 'Test reducer 1', target: 10, units: 'tests' },
      { id: 1, name: 'Test reducer 2', target: 5, units: 'tests' },
    ]
    const expectedState = [initialState[0], { id, name, target, units }]

    expect(reducer(initialState, updateGoal(id, name, target, units))).toEqual(
      expectedState
    )
  })
})
