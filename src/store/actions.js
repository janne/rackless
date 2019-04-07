import {
  SET_PATCH,
  SET_VALUE,
  SET_INSTRUMENT,
  MOVE_MODULE,
  CREATE_CABLE,
  MOVE_CONNECTOR,
  REMOVE_CONNECTOR,
  DRAG_CONNECTOR,
  CREATE_MODULE,
  DELETE_MODULE,
  SET_DB,
  SET_USER
} from "./actionTypes"
import { getDB, getUser, getPatch } from "./selectors"

export const fetchPatch = () => {
  return (dispatch, getState) => {
    const state = getState()
    const uid = getUser(state)
    const prefix = `/patches/${uid}`
    getDB(state)
      .ref(prefix)
      .on("value", patch => {
        dispatch(setPatch(patch.val() || {}))
      })
  }
}

export const dispatchAndPersist = action => {
  return (dispatch, getState) => {
    dispatch(action)
    const state = getState()
    const uid = getUser(state)
    getDB(state)
      .ref(`/patches/${uid}`)
      .set(getPatch(state))
  }
}

export const setDB = db => ({
  type: SET_DB,
  payload: { db }
})

export const setUser = uid => ({
  type: SET_USER,
  payload: { uid }
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

export const removeConnector = id => ({
  type: REMOVE_CONNECTOR,
  payload: { id }
})

export const dragConnector = (id, connector, pos) => ({
  type: DRAG_CONNECTOR,
  payload: { id, connector, pos }
})

export const createModule = type => ({
  type: CREATE_MODULE,
  payload: { type }
})

export const deleteModule = id => ({
  type: DELETE_MODULE,
  payload: { id }
})
