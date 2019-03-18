import {
  CHANGE_TRIMPOT,
  MOVE_MODULE,
  CREATE_CABLE,
  MOVE_CONNECTOR
} from "./actionTypes"

export const changeTrimpot = (id, name, value) => ({
  type: CHANGE_TRIMPOT,
  payload: { id, name, value }
})

export const createCableFrom = (id, fromId, fromSocket, color) => ({
  type: CREATE_CABLE,
  payload: { id, fromId, fromSocket, toId: fromId, toSocket: fromSocket, color }
})

export const moveModule = (id, col, row) => ({
  type: MOVE_MODULE,
  payload: { id, col, row }
})

export const moveConnector = (id, connector, pos) => ({
  type: MOVE_CONNECTOR,
  payload: { id, connector, pos }
})
