import * as R from "ramda"
import Tone from "tone"
import { CHANGE_TRIMPOT, CREATE_OSCILLATOR } from "./actionTypes"

const initialState = {}

export default (state = initialState, action) => {
  switch (action.type) {
    case CHANGE_TRIMPOT: {
      const { module, pot, value } = action.payload
      return R.set(R.lensPath([module, pot, "value"]), value, state)
    }
    case CREATE_OSCILLATOR: {
      const { module } = action.payload
      const oscillator = new Tone.Oscillator().start().toMaster()
      return R.set(R.lensPath([module, "oscillator"]), oscillator, state)
    }
    default:
      return state
  }
}
