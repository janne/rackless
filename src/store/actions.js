import { CHANGE_TRIMPOT, CREATE_OSCILLATOR } from "./actionTypes"

export const changeTrimpot = (module, pot, value) => ({
  type: CHANGE_TRIMPOT,
  payload: { module, pot, value }
})

export const createOscillator = module => ({
  type: CREATE_OSCILLATOR,
  payload: { module }
})
