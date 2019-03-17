import * as R from "ramda"
import Tone from "tone"
import {
  CHANGE_TRIMPOT,
  CREATE_OSCILLATOR,
  MOVE_MODULE,
  CREATE_CABLE
} from "./actionTypes"

const initialState = {
  modules: [
    { type: "VCO", data: { id: "vco::2", col: 1, row: 0 } },
    { type: "VCO", data: { id: "vco::1", col: 12, row: 0 } },
    { type: "AUDIO", data: { id: "audio::1", col: 23, row: 0 } }
  ],
  cables: [
    {
      id: "patch::1",
      fromId: "vco::1",
      fromSocket: "sin",
      toId: "audio::1",
      toSocket: "input1",
      color: "red"
    },
    {
      id: "patch::2",
      fromId: "vco::2",
      fromSocket: "sin",
      toId: "audio::1",
      toSocket: "input2",
      color: "green"
    },
    {
      id: "patch::2",
      fromId: "audio::1",
      fromSocket: "input6",
      toId: "audio::1",
      toSocket: "input4",
      color: "blue"
    }
  ]
}

export default (state = initialState, action) => {
  switch (action.type) {
    case CHANGE_TRIMPOT: {
      const { id, name, value } = action.payload
      return R.set(R.lensPath([id, name, "value"]), value, state)
    }
    case CREATE_OSCILLATOR: {
      const { id } = action.payload
      const oscillator = new Tone.Oscillator().start().toMaster()
      return R.set(R.lensPath([id, "oscillator"]), oscillator, state)
    }
    case MOVE_MODULE: {
      const { id, col, row } = action.payload
      return R.compose(
        R.set(R.lensPath([id, "col"]), col),
        R.set(R.lensPath([id, "row"]), row)
      )(state)
    }
    case CREATE_CABLE: {
      const { id, fromId, fromSocket, toId, toSocket, color } = action.payload
      return {
        ...state,
        cables: [
          ...state.cables,
          { id, fromId, fromSocket, toId, toSocket, color }
        ]
      }
    }
    default:
      return state
  }
}
