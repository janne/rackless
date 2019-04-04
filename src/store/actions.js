import * as R from "ramda"
import {
  GET_PATCH,
  SET_VALUE,
  MOVE_MODULE,
  CREATE_CABLE,
  MOVE_CONNECTOR,
  REMOVE_CONNECTOR
} from "./actionTypes"

export const loadPatch = (db, id) => {
  return dispatch => {
    const prefix = `/patches/-LbdSzlodm0lwGVAag7D`
    db.ref(prefix).on("value", patch => {
      if (R.isNil(patch.val())) return
      dispatch(updatePatch(patch.val()))
    })
  }
}

export const updatePatch = payload => ({
  type: GET_PATCH,
  payload
})

export const setValue = (id, name, value) => ({
  type: SET_VALUE,
  payload: { id, name, value }
})

export const createCable = (id, moduleId, socketId, color) => ({
  type: CREATE_CABLE,
  payload: {
    id,
    outputModule: moduleId,
    outputSocket: socketId,
    color
  }
})

export const moveModule = (id, col, row) => ({
  type: MOVE_MODULE,
  payload: { id, col, row }
})

export const moveConnector = (id, connector, pos) => ({
  type: MOVE_CONNECTOR,
  payload: { id, connector, pos }
})

export const removeConnector = (id, connector, pos) => ({
  type: REMOVE_CONNECTOR,
  payload: { id, connector, pos }
})
