import { CHANGE_TRIMPOT } from "./actionTypes"

export const changeTrimpot = (module, pot, value) => ({
  type: CHANGE_TRIMPOT,
  payload: { module, pot, value }
})
