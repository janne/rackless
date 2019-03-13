import { CHANGE_TRIMPOT, CREATE_OSCILLATOR, MOVE_MODULE } from "./actionTypes"

export const changeTrimpot = (id, pot, value) => ({
  type: CHANGE_TRIMPOT,
  payload: { id, pot, value }
})

export const createOscillator = id => ({
  type: CREATE_OSCILLATOR,
  payload: { id }
})

export const moveModule = (id, x, y) => ({
  type: MOVE_MODULE,
  payload: { id, x, y }
})
