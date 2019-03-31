import * as R from "ramda"
import uuidv1 from "uuid/v1"
import { socketAtPos } from "./selectors"
import {
  SET_VALUE,
  MOVE_MODULE,
  CREATE_CABLE,
  MOVE_CONNECTOR,
  REMOVE_CONNECTOR
} from "./actionTypes"

const vco = uuidv1()
const output = uuidv1()

const initialState = {
  modules: {
    [vco]: { type: "VCO", col: 1, row: 0 },
    [output]: { type: "Output", col: 12, row: 0 }
  },
  cables: {
    [uuidv1()]: {
      outputModule: vco,
      outputSocket: 0,
      inputModule: output,
      inputSocket: 0,
      color: "red"
    }
  }
}

export default (state = initialState, action) => {
  const setCableDisabled = value =>
    R.set(R.lensPath(["cables", action.payload.id, "disabled"]), value, state)

  switch (action.type) {
    case SET_VALUE: {
      const { id, name, value } = action.payload
      return R.set(R.lensPath(["modules", id, name]), value, state)
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
        outputModule,
        outputSocket,
        inputModule,
        inputSocket,
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
        connector === "output"
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
