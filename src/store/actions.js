import {
  ADD_MODULE,
  SET_VALUE,
  MOVE_MODULE,
  CREATE_CABLE,
  MOVE_CONNECTOR,
  REMOVE_CONNECTOR
} from "./actionTypes"

export const loadPatch = (db, id) => {
  return dispatch => {
    const ref = db
      .collection("patches")
      .doc(id)
      .collection("modules")

    ref
      .get()
      .then(snapshot =>
        snapshot.forEach(mod =>
          dispatch(addModule({ ...mod.data(), id: mod.id }))
        )
      )
  }
}

export const addModule = payload => ({
  type: ADD_MODULE,
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
