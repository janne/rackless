import * as R from "ramda"
import uuidv1 from "uuid/v1"
import { socketAtPos } from "./selectors"
import {
  SET_VALUE,
  MOVE_MODULE,
  CREATE_CABLE,
  MOVE_CONNECTOR
} from "./actionTypes"

const vco1 = uuidv1()
const vco2 = uuidv1()
const audio = uuidv1()

const initialState = {
  modules: {
    [vco1]: { type: "VCO", col: 1, row: 0 },
    [vco2]: { type: "VCO", col: 12, row: 0 },
    [audio]: { type: "AUDIO", col: 23, row: 0 }
  },
  cables: {
    [uuidv1()]: {
      fromId: vco1,
      fromSocket: "o0",
      toId: audio,
      toSocket: "i0",
      color: "red"
    },
    [uuidv1()]: {
      fromId: vco2,
      fromSocket: "o0",
      toId: audio,
      toSocket: "i1",
      color: "green"
    }
  }
}

export default (state = initialState, action) => {
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
      const { id, fromId, fromSocket, toId, toSocket, color } = action.payload
      return {
        ...state,
        cables: {
          ...state.cables,
          [id]: { fromId, fromSocket, toId, toSocket, color }
        }
      }
    }
    case MOVE_CONNECTOR: {
      const { id, connector, pos } = action.payload
      const movedCable = state.cables[id]
      const cables = R.dissoc(id, state.cables)
      const target = socketAtPos(pos, state)

      if (!target) return { ...state, cables }

      const updatedCable =
        connector === 1
          ? { ...movedCable, fromId: target.id, fromSocket: target.socket }
          : { ...movedCable, toId: target.id, toSocket: target.socket }
      return { ...state, cables: { ...cables, [id]: updatedCable } }
    }
    default:
      return state
  }
}
