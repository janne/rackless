import {
  CHANGE_TRIMPOT,
  CREATE_OSCILLATOR,
  MOVE_MODULE,
  CREATE_CABLE,
  DESTROY_CABLE
} from "./actionTypes"

export const changeTrimpot = (id, name, value) => ({
  type: CHANGE_TRIMPOT,
  payload: { id, name, value }
})

export const createOscillator = id => ({
  type: CREATE_OSCILLATOR,
  payload: { id }
})

export const createCableFrom = (id, fromId, fromSocket, color) => ({
  type: CREATE_CABLE,
  payload: { id, fromId, fromSocket, toId: fromId, toSocket: fromSocket, color }
})

export const moveModule = (id, col, row) => ({
  type: MOVE_MODULE,
  payload: { id, col, row }
})

export const destroyCable = id => ({
  type: DESTROY_CABLE,
  payload: { id }
})
