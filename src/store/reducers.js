import * as R from "ramda"
import { socketAtPos } from "./selectors"
import {
  SET_VALUE,
  SET_INSTRUMENT,
  MOVE_MODULE,
  CREATE_CABLE,
  MOVE_CONNECTOR,
  REMOVE_CONNECTOR,
  SET_PATCH,
  SET_DB
} from "./actionTypes"

const initialState = {
  modules: {},
  cables: {}
}

export default (state = initialState, action) => {
  const setCableDisabled = value =>
    R.set(R.lensPath(["cables", action.payload.id, "disabled"]), value, state)

  switch (action.type) {
    case SET_PATCH: {
      return { ...state, ...action.payload }
    }
    case SET_VALUE: {
      const { id, name, value } = action.payload
      return R.set(R.lensPath(["modules", id, name]), value, state)
    }
    case SET_DB: {
      const { db } = action.payload
      return { ...state, db }
    }
    case SET_INSTRUMENT: {
      const { id, instrument } = action.payload
      console.log(R.set(R.lensPath(["instruments", id]), instrument, state))
      return R.set(R.lensPath(["instruments", id]), instrument, state)
    }
    case MOVE_MODULE: {
      const { id, col, row } = action.payload
      return R.compose(
        R.set(R.lensPath(["modules", id, "col"]), col),
        R.set(R.lensPath(["modules", id, "row"]), row)
      )(state)
    }
    case CREATE_CABLE: {
      const {
        id,
        outputModule = null,
        outputSocket = null,
        inputModule = null,
        inputSocket = null,
        color
      } = action.payload
      return {
        ...state,
        cables: {
          ...state.cables,
          [id]: { outputModule, outputSocket, inputModule, inputSocket, color }
        }
      }
    }
    case MOVE_CONNECTOR: {
      const { id, connector, pos } = action.payload
      const state = setCableDisabled(false)
      const movedCable = state.cables[id]
      const cables = R.dissoc(id, state.cables)
      const target = socketAtPos(pos, connector, state)

      if (!target) return { ...state, cables }

      const updatedCable =
        connector === "outputs"
          ? {
              ...movedCable,
              outputModule: target.moduleId,
              outputSocket: target.socketId
            }
          : {
              ...movedCable,
              inputModule: target.moduleId,
              inputSocket: target.socketId
            }
      return { ...state, cables: { ...cables, [id]: updatedCable } }
    }
    case REMOVE_CONNECTOR: {
      return setCableDisabled(true)
    }
    default:
      return state
  }
}
