import {
  SET_PATCH,
  SET_VALUE,
  SET_MODULE_VALUE,
  SET_INSTRUMENT,
  MOVE_MODULE,
  CREATE_CABLE,
  MOVE_CONNECTOR,
  REMOVE_CONNECTOR,
  DRAG_CONNECTOR,
  CREATE_MODULE,
  DELETE_MODULE,
  SET_LOGGED_IN,
  SET_LOADING,
  TOGGLE_DELETE
} from "./actionTypes"
import { getPatch } from "./selectors"
import * as firebase from "../utils/firebase"
import debounce from "../utils/debounce"

export const fetchPatch = user => dispatch => {
  dispatch(setLoading(true))
  firebase.subscribeToPatch(user, patch => {
    dispatch(setLoading(false))
    dispatch(setPatch(patch.val() || {}))
  })
}

const persist = debounce(
  getState =>
    firebase
      .getCurrentOrAnonymousUser()
      .then(user => firebase.setPatch(user, getPatch(getState()))),
  1000
)

export const dispatchAndPersist = action => (dispatch, getState) => {
  dispatch(action)
  persist(getState)
}

export const signOut = () => dispatch => {
  firebase.signOut().then(() =>
    dispatch(
      setPatch({
        isLoggedIn: false,
        modules: null,
        cables: null,
        instruments: null
      })
    )
  )
}

export const setLoggedIn = isLoggedIn => ({
  type: SET_LOGGED_IN,
  payload: { isLoggedIn }
})

export const setLoading = isLoading => ({
  type: SET_LOADING,
  payload: { isLoading }
})

export const setPatch = payload => ({
  type: SET_PATCH,
  payload
})

export const setInstrument = (id, instrument) => ({
  type: SET_INSTRUMENT,
  payload: { id, instrument }
})

export const createCable = (id, moduleId, socketId, direction, color) => {
  const socket =
    direction === "outputs"
      ? { outputModule: moduleId, outputSocket: socketId }
      : { inputModule: moduleId, inputSocket: socketId }
  return dispatchAndPersist({
    type: CREATE_CABLE,
    payload: {
      id,
      color,
      ...socket
    }
  })
}

export const setValue = (id, name, value) => ({
  type: SET_VALUE,
  payload: { id, name, value }
})

export const setModuleValue = (id, name, value) => ({
  type: SET_MODULE_VALUE,
  payload: { id, name, value }
})

export const moveModule = (id, col, row) => ({
  type: MOVE_MODULE,
  payload: { id, col, row }
})

export const moveConnector = (id, connector, pos) =>
  dispatchAndPersist({
    type: MOVE_CONNECTOR,
    payload: { id, connector, pos }
  })

export const removeConnector = id =>
  dispatchAndPersist({
    type: REMOVE_CONNECTOR,
    payload: { id }
  })

export const dragConnector = (id, connector, pos) => ({
  type: DRAG_CONNECTOR,
  payload: { id, connector, pos }
})

export const createModule = type =>
  dispatchAndPersist({
    type: CREATE_MODULE,
    payload: { type }
  })

export const deleteModule = id => ({
  type: DELETE_MODULE,
  payload: { id }
})

export const toggleDelete = () => ({ type: TOGGLE_DELETE })
