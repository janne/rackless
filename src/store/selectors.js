import * as R from "ramda"
import { HP_PIX, HEIGHT_PIX, ZOOM } from "../constants"
import modules from "../modules"

const WIDTH = 5 * ZOOM

export const getSockets = (moduleId, direction, state) => {
  const type = R.path(["modules", moduleId, "type"], state)
  return R.pathOr([], [type, direction], modules)
}

export const socketToPos = (moduleId, direction, socketId, state) => {
  const { row, col } = R.pathOr({}, ["modules", moduleId], state)
  const socket = R.find(
    R.propEq("socketId", socketId),
    getSockets(moduleId, direction, state)
  )
  return {
    x: col * HP_PIX + socket.x * ZOOM,
    y: row * HEIGHT_PIX + socket.y * ZOOM
  }
}

export const socketAtPos = ({ x, y }, direction, state) => {
  for (let moduleId of R.keys(state.modules)) {
    const { col, row } = state.modules[moduleId]
    const socket = getSockets(moduleId, direction, state).find(
      socket =>
        x > col * HP_PIX + socket.x * ZOOM - WIDTH &&
        x < col * HP_PIX + socket.x * ZOOM + WIDTH &&
        y > row * HEIGHT_PIX + socket.y * ZOOM - WIDTH &&
        y < row * HEIGHT_PIX + socket.y * ZOOM + WIDTH
    )
    if (socket) return { moduleId, socketId: socket.socketId }
  }
  return null
}
