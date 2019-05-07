import * as R from "ramda"
import {
  SET_DATA,
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
  TOGGLE_DELETE,
  RESET_STATE,
  CREATE_PATCH,
  SET_CURRENT,
  DELETE_PATCH,
  DELETE_INSTRUMENT
} from "./actionTypes"
import { getData } from "./selectors"
import * as firebase from "../utils/firebase"
import debounce from "../utils/debounce"

// Upgrade legacy structure with patch in root data
// Can be deleted once no more such users
const updatePatch = data => {
  const patchKey = firebase.getDbKey("patches")
  return {
    current: patchKey,
    patches: {
      [patchKey]: {
        modules: data.modules,
        cables: data.cables,
        createdAt: new Date().toISOString()
      }
    }
  }
}

export const fetchData = user => dispatch => {
  dispatch(setLoading(true))
  firebase.subscribeToData(user, dataSnapshot => {
    const data = dataSnapshot.val()
    dispatch(setLoading(false))
    if (R.prop("modules", data)) return dispatch(setData(updatePatch(data)))
    return dispatch(setData(data))
  })
}

const persist = debounce(
  getState =>
    firebase
      .getCurrentOrAnonymousUser()
      .then(user => firebase.setData(user, getData(getState()))),
  1000
)

const dispatchAndPersist = action => (dispatch, getState) => {
  dispatch(action)
  persist(getState)
}

export const signOut = () => dispatch => {
  dispatch(resetState())
  firebase.signOut()
}

export const resetState = () => ({
  type: RESET_STATE
})

export const setLoggedIn = isLoggedIn => ({
  type: SET_LOGGED_IN,
  payload: { isLoggedIn }
})

export const setLoading = isLoading => ({
  type: SET_LOADING,
  payload: { isLoading }
})

export const setData = data => ({
  type: SET_DATA,
  payload: { data }
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

export const setValue = (id, name, value) =>
  dispatchAndPersist({
    type: SET_VALUE,
    payload: { id, name, value }
  })

export const setModuleValue = (id, name, value) => ({
  type: SET_MODULE_VALUE,
  payload: { id, name, value }
})

export const moveModule = (id, col, row) =>
  dispatchAndPersist({
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

export const deleteModule = id =>
  dispatchAndPersist({
    type: DELETE_MODULE,
    payload: { id }
  })

export const setCurrent = id =>
  dispatchAndPersist({
    type: SET_CURRENT,
    payload: { id }
  })

export const deletePatch = id =>
  dispatchAndPersist({ type: DELETE_PATCH, payload: { id } })

export const toggleDelete = () => ({ type: TOGGLE_DELETE })

export const createPatch = () => dispatchAndPersist({ type: CREATE_PATCH })

export const deleteInstrument = id => ({
  type: DELETE_INSTRUMENT,
  payload: { id }
})

export const sharePatch = (uid, patchId) => () => {
  window.location = `/${uid}${patchId}`
}
