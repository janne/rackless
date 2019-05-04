import * as R from "ramda"
import { getDbKey } from "../utils/firebase"
import {
  socketAtPos,
  findFreePos,
  availablePos,
  getModule,
  getModules,
  getInstruments,
  getCables,
  getCable
} from "./selectors"
import {
  SET_VALUE,
  SET_MODULE_VALUE,
  SET_INSTRUMENT,
  CREATE_MODULE,
  DELETE_MODULE,
  MOVE_MODULE,
  CREATE_CABLE,
  MOVE_CONNECTOR,
  DRAG_CONNECTOR,
  REMOVE_CONNECTOR,
  SET_DATA,
  SET_LOGGED_IN,
  SET_LOADING,
  TOGGLE_DELETE
} from "./actionTypes"

const initialState = {
  isLoading: true,
  isLoggedIn: false,
  deleting: false
}

export default (state = initialState, action) => {
  const setCableDisabled = value =>
    R.set(
      R.lensPath(["data", "cables", action.payload.id, "disabled"]),
      value,
      state
    )

  switch (action.type) {
    case TOGGLE_DELETE: {
      return { ...state, deleting: !state.deleting }
    }
    case SET_DATA: {
      return { ...state, data: action.payload.data }
    }

    case SET_VALUE: {
      const { id, name, value } = action.payload
      return R.set(
        R.lensPath(["data", "modules", id, "values", name]),
        value,
        state
      )
    }

    case SET_MODULE_VALUE: {
      const { id, name, value } = action.payload
      return R.set(R.lensPath(["data", "modules", id, name]), value, state)
    }

    case SET_LOGGED_IN: {
      const { isLoggedIn } = action.payload
      return { ...state, isLoggedIn }
    }

    case SET_LOADING: {
      const { isLoading } = action.payload
      return { ...state, isLoading }
    }

    case SET_INSTRUMENT: {
      const { id, instrument } = action.payload
      return R.set(R.lensPath(["instruments", id]), instrument, state)
    }

    case MOVE_MODULE: {
      const { id, col, row } = action.payload
      const { hp, col: oldCol, row: oldRow } = getModule(id, state)
      const moveIfPossible = (newCol = col) => {
        if (newCol < 0 || row < 0) return null
        if (availablePos(newCol, row, hp, id, state)) {
          return R.compose(
            R.set(R.lensPath(["data", "modules", id, "col"]), newCol),
            R.set(R.lensPath(["data", "modules", id, "row"]), row)
          )(state)
        }
        return null
      }
      if (row !== oldRow) return moveIfPossible() || state
      const diff = Math.sign(col - oldCol)
      for (const n of R.range(0, Math.abs(col - oldCol))) {
        const newState = moveIfPossible(col - n * diff)
        if (newState) return newState
      }
      return state
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
      return R.assocPath(
        ["data", "cables", id],
        {
          outputModule,
          outputSocket,
          inputModule,
          inputSocket,
          color,
          disabled: true
        },
        state
      )
    }
    case MOVE_CONNECTOR: {
      const { id, connector, pos } = action.payload
      const state = setCableDisabled(false)
      const movedCable = getCable(id, state)
      const cables = R.dissoc(id, getCables(state))
      const target = socketAtPos(pos, connector, state)

      if (!target) return R.assocPath(["data", "cables"], cables, state)

      const existingCables = R.filter(
        ({ inputModule, inputSocket, outputModule, outputSocket }) =>
          (connector === "inputs" &&
            inputModule === target.moduleId &&
            inputSocket === target.socketId) ||
          (connector === "outputs" &&
            outputModule === target.moduleId &&
            outputSocket === target.socketId),
        cables
      )

      if (!R.isEmpty(existingCables))
        return R.assocPath(["data", "cables"], cables, state)

      const updatedCable =
        connector === "outputs"
          ? {
              ...movedCable,
              drag: null,
              outputModule: target.moduleId,
              outputSocket: target.socketId
            }
          : {
              ...movedCable,
              drag: null,
              inputModule: target.moduleId,
              inputSocket: target.socketId
            }
      return R.assocPath(["data", "cables", id], updatedCable, state)
    }

    case REMOVE_CONNECTOR: {
      return setCableDisabled(true)
    }

    case DRAG_CONNECTOR: {
      const { id, connector, pos } = action.payload
      return R.set(
        R.lensPath(["data", "cables", id, "drag"]),
        { pos, connector },
        state
      )
    }

    case CREATE_MODULE: {
      const { type } = action.payload
      const key = getDbKey("modules")
      const pos = findFreePos(10, state)
      const values = {}
      return R.assocPath(
        ["data", "modules", key],
        { type, values, ...pos },
        state
      )
    }

    case DELETE_MODULE: {
      const { id } = action.payload
      return {
        ...state,
        data: {
          modules: R.dissoc(id, getModules(state)),
          cables: R.reject(
            cable => cable.outputModule === id || cable.inputModule === id,
            getCables(state)
          )
        },
        instruments: R.dissoc(id, getInstruments(state))
      }
    }

    default:
      return state
  }
}
