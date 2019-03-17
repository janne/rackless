import * as R from "ramda"
import Tone from "tone"
import uuidv1 from "uuid/v1"
import {
  CHANGE_TRIMPOT,
  CREATE_OSCILLATOR,
  MOVE_MODULE,
  CREATE_CABLE,
  DESTROY_CABLE
} from "./actionTypes"

const vco1 = uuidv1()
const vco2 = uuidv1()
const audio = uuidv1()

const initialState = {
  modules: [
    { type: "VCO", data: { id: vco2, col: 1, row: 0 } },
    { type: "VCO", data: { id: vco1, col: 12, row: 0 } },
    { type: "AUDIO", data: { id: audio, col: 23, row: 0 } }
  ],
  cables: [
    {
      id: uuidv1(),
      fromId: vco1,
      fromSocket: "sin",
      toId: audio,
      toSocket: "input1",
      color: "red"
    },
    {
      id: uuidv1(),
      fromId: vco2,
      fromSocket: "sin",
      toId: audio,
      toSocket: "input2",
      color: "green"
    },
    {
      id: uuidv1(),
      fromId: audio,
      fromSocket: "input6",
      toId: audio,
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
    case DESTROY_CABLE: {
      const { id } = action.payload
      return { ...state, cables: state.cables.filter(c => c.id !== id) }
    }
    default:
      return state
  }
}
