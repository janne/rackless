import * as R from "ramda"
import { sockets as socketsVCO } from "../components/VCO"
import { sockets as socketsAudio } from "../components/Audio"
import { HP_PIX, HEIGHT_PIX, ZOOM } from "../constants"

const WIDTH = 5 * ZOOM

export const getSockets = (id, state) => {
  switch (state.modules[id].type) {
    case "VCO":
      return socketsVCO
    case "AUDIO":
      return socketsAudio
    default:
      return null
  }
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
