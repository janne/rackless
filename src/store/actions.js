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
import firebase from "firebase/app"

export const fetchPatch = user => dispatch => {
  dispatch(setLoading(true))
  firebase
    .database()
    .ref(`/users/${user.uid}`)
    .on("value", patch => {
      dispatch(setLoading(false))
      dispatch(setPatch(patch.val() || {}))
    })
}

let debouncer
export const dispatchAndPersist = action => {
  return (dispatch, getState) => {
    dispatch(action)
    if (debouncer) return
    debouncer = setTimeout(() => {
      debouncer = null
      new Promise(resolve => {
        const user = firebase.auth().currentUser
        if (user) return resolve(user)
        firebase
          .auth()
          .signInAnonymously()
          .then(({ user }) => resolve(user))
      }).then(user => {
        firebase
          .database()
          .ref(`/users/${user.uid}`)
          .set(getPatch(getState()))
      })
    }, 1000)
  }
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
  return {
    type: CREATE_CABLE,
    payload: {
      id,
      color,
      ...socket
    }
  }
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

export const toggleDelete = () => ({ type: TOGGLE_DELETE })
