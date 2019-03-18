import { sockets as socketsVCO } from "../components/VCO"
import { sockets as socketsAudio } from "../components/Audio"
import { HP_PIX, HEIGHT_PIX, ZOOM } from "../constants"

const WIDTH = 3.3 * ZOOM

export const getSockets = (id, state) => {
  const module = state.modules.find(m => m.data.id === id)
  switch (module.type) {
    case "VCO":
      return socketsVCO
    case "AUDIO":
      return socketsAudio
    default:
      return null
  }
}

export const socketAtPos = ({ x, y }, state) => {
  for (let mod of state.modules) {
    const { col, row, id } = mod.data
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
