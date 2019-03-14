import { CHANGE_TRIMPOT, CREATE_OSCILLATOR, MOVE_MODULE } from "./actionTypes"

export const changeTrimpot = (id, name, value) => ({
  type: CHANGE_TRIMPOT,
  payload: { id, name, value }
})

export const createOscillator = id => ({
  type: CREATE_OSCILLATOR,
  payload: { id }
})

export const moveModule = (id, col, row) => ({
  type: MOVE_MODULE,
  payload: { id, col, row }
})
