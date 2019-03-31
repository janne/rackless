import * as R from "ramda"
import { HP_PIX, HEIGHT_PIX, ZOOM } from "../constants"
import moduleTypes from "../moduleTypes"

const WIDTH = 5 * ZOOM

export const getSockets = (id, state) => {
  const type = R.path(["modules", id, "type"], state)
  return R.pathOr(null, [type, "sockets"], moduleTypes)
}

export const socketToPos = (moduleId, socketName, state) => {
  const { row, col } = R.pathOr({}, ["modules", moduleId], state)
  const socket = R.find(
    R.propEq("name", socketName),
    getSockets(moduleId, state)
  )
  return {
    x: col * HP_PIX + socket.x * ZOOM,
    y: row * HEIGHT_PIX + socket.y * ZOOM
  }
}

export const socketAtPos = ({ x, y }, state) => {
  for (let id of R.keys(state.modules)) {
    const { col, row } = state.modules[id]
    const socket = getSockets(id, state).find(
      socket =>
        x > col * HP_PIX + socket.x * ZOOM - WIDTH &&
        x < col * HP_PIX + socket.x * ZOOM + WIDTH &&
        y > row * HEIGHT_PIX + socket.y * ZOOM - WIDTH &&
        y < row * HEIGHT_PIX + socket.y * ZOOM + WIDTH
    )
    if (socket) return { id, socket: socket.name }
  }
  return null
}
