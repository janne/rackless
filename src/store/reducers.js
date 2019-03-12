import * as R from "ramda"
import { CHANGE_TRIMPOT } from "./actionTypes"

const initialState = {}

export default (state = initialState, action) => {
  switch (action.type) {
    case CHANGE_TRIMPOT: {
      const { module, pot, value } = action.payload
      return R.set(R.lensPath([module, pot, "value"]), value, state)
    }
    default:
      return state
  }
}
