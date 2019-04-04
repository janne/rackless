import * as R from "ramda"
import {
  SET_PATCH,
  SET_VALUE,
  SET_INSTRUMENT,
  MOVE_MODULE,
  CREATE_CABLE,
  MOVE_CONNECTOR,
  REMOVE_CONNECTOR,
  SET_DB
} from "./actionTypes"
import { getDB, getPatch } from "./selectors"

const prefix = `/patches/-LbdSzlodm0lwGVAag7D`

export const fetchPatch = db => {
  return dispatch => {
    dispatch(setDB(db))
    db.ref(prefix).on("value", patch => {
      if (R.isNil(patch.val())) return
      dispatch(setPatch(patch.val()))
    })
  }
}

export const persistPatch = (db, patch) => {
  return () => db.ref(prefix).set(patch)
}

export const createCableAndPersist = (moduleId, socketId, color) => {
  return (dispatch, getState) => {
    const db = getDB(getState())
    var key = db
      .ref()
      .child("cables")
      .push().key
    dispatch(createCable(key, moduleId, socketId, color))
    const patch = getPatch(getState())
    if (R.isNil(patch)) return
    db.ref(prefix).set(patch)
  }
}

export const dispatchAndPersist = action => {
  return (dispatch, getState) => {
    dispatch(action)
    const state = getState()
    const db = getDB(state)
    const patch = getPatch(state)
    if (R.isNil(patch)) return
    db.ref(prefix).set(patch)
  }
}

export const setDB = db => ({
  type: SET_DB,
  payload: { db }
})

export const setPatch = payload => ({
  type: SET_PATCH,
  payload
})

export const setInstrument = (id, instrument) => ({
  type: SET_INSTRUMENT,
  payload: { id, instrument }
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

export const setValue = (id, name, value) => ({
  type: SET_VALUE,
  payload: { id, name, value }
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
