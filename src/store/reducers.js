import * as R from "ramda"
import Tone from "tone"
import { CHANGE_TRIMPOT, CREATE_OSCILLATOR, MOVE_MODULE } from "./actionTypes"

const initialState = {}

export default (state = initialState, action) => {
  switch (action.type) {
    case CHANGE_TRIMPOT: {
      const { id, pot, value } = action.payload
      return R.set(R.lensPath([id, pot, "value"]), value, state)
    }
    case CREATE_OSCILLATOR: {
      const { id } = action.payload
      const oscillator = new Tone.Oscillator().start().toMaster()
      return R.set(R.lensPath([id, "oscillator"]), oscillator, state)
    }
    case MOVE_MODULE: {
      const { id, x, y } = action.payload
      return R.compose(
        R.set(R.lensPath([id, "x"]), x),
        R.set(R.lensPath([id, "y"]), y)
      )(state)
    }
    default:
      return state
  }
}
