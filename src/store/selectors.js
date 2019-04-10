import * as R from "ramda"
import { HP_PIX, HEIGHT_PIX } from "../constants"
import * as moduleTypes from "../modules"

const WIDTH = 15

export const getPatch = R.pick(["modules", "cables"])

export const getDB = R.prop("db")

export const getUser = R.prop("uid")

export const getSockets = (moduleId, direction, state) => {
  const type = R.path(["modules", moduleId, "type"], state)
  return R.pathOr([], [type, direction], moduleTypes)
}

export const socketToPos = (moduleId, direction, socketId, state) => {
  if (R.isNil(moduleId) || R.isNil(socketId)) return {}
  const { row, col } = R.pathOr({}, ["modules", moduleId], state)
  const socket = getSockets(moduleId, direction, state)[socketId]
  return {
    x: col * HP_PIX + socket.x,
    y: row * HEIGHT_PIX + socket.y
  }
}

export const socketAtPos = ({ x, y }, direction, state) => {
  for (let moduleId of R.keys(state.modules)) {
    const { col, row } = state.modules[moduleId]
    const sockets = getSockets(moduleId, direction, state)
    const socketId = R.findIndex(
      socket =>
        x > col * HP_PIX + socket.x - WIDTH &&
        x < col * HP_PIX + socket.x + WIDTH &&
        y > row * HEIGHT_PIX + socket.y - WIDTH &&
        y < row * HEIGHT_PIX + socket.y + WIDTH,
      sockets
    )
    if (socketId !== -1) return { moduleId, socketId }
  }
  return null
}
