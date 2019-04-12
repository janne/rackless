import * as R from "ramda"
import IntervalTree from "node-interval-tree"
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
    const socketId = R.find(
      socket =>
        x > col * HP_PIX + sockets[socket].x - WIDTH &&
        x < col * HP_PIX + sockets[socket].x + WIDTH &&
        y > row * HEIGHT_PIX + sockets[socket].y - WIDTH &&
        y < row * HEIGHT_PIX + sockets[socket].y + WIDTH,
      R.keys(sockets)
    )
    if (Boolean(socketId)) return { moduleId, socketId }
  }
  return null
}

const hpPerRow = () => Math.floor(window.innerWidth / HP_PIX)

export const intervalTree = state => {
  const intervalTree = new IntervalTree()

  R.map(
    m => ({
      pos: Math.round(m.row * hpPerRow() + m.col),
      hp: m.hp
    }),
    R.values(R.prop("modules", state))
  ).forEach(m => intervalTree.insert(m.pos, m.pos + m.hp - 1))

  return intervalTree
}

export const findFreePos = (neededSpace = 10, state) => {
  const tree = intervalTree(state)

  for (let i of R.range(0, 1000)) {
    if (R.isEmpty(tree.search(i, i + neededSpace - 1))) {
      const row = Math.floor(i / hpPerRow())
      const col = i % hpPerRow()
      return { col, row }
    }
  }

  return { col: 0, row: 0 }
}
