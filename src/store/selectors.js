import * as R from "ramda"
import IntervalTree from "node-interval-tree"
import { HP_PIX, HEIGHT_PIX } from "../constants"
import * as moduleTypes from "../modules"

const WIDTH = 15

export const getPatch = R.pick(["modules", "cables"])

export const getLoggedIn = R.prop("isLoggedIn")

export const getLoading = R.prop("isLoading")

export const getModule = (moduleId, state) =>
  R.path(["modules", moduleId], state)

export const getSockets = (moduleId, direction, state) => {
  const type = R.path(["modules", moduleId, "type"], state)
  return R.pathOr([], [type, direction], moduleTypes)
}

export const socketToPos = (moduleId, direction, socketId, state) => {
  if (R.isNil(moduleId) || R.isNil(socketId)) return {}
  const { row, col } = R.pathOr({}, ["modules", moduleId], state)
  const socket = getSockets(moduleId, direction, state)[socketId]
  if (R.isNil(socket)) return {}
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

export const intervalTree = modules => {
  const intervalTree = new IntervalTree()
  modules.forEach(({ pos, width }) => intervalTree.insert(pos, pos + width - 1))
  return intervalTree
}

const hpPerRow = () => Math.floor(window.innerWidth / HP_PIX)

export const availablePos = (col, row, width, excludeId, state) => {
  const modules = R.filter(
    R.propEq("row", row),
    R.values(
      R.mapObjIndexed((m, id) => ({ ...m, id }), R.prop("modules", state))
    )
  )

  const modulesExcludingSelf = R.reject(R.propEq("id", excludeId), modules)

  const linearModules = R.map(
    m => ({
      pos: m.col,
      width: m.hp
    }),
    modulesExcludingSelf
  )

  const tree = intervalTree(linearModules)

  return R.isEmpty(tree.search(col, col + width - 1))
}

export const findFreePos = (neededSpace = 10, state) => {
  const linearModules = R.map(
    m => ({
      pos: Math.round(m.row * hpPerRow() + m.col),
      width: m.hp
    }),
    R.values(R.prop("modules", state))
  )

  const tree = intervalTree(linearModules)

  for (let i of R.range(0, 1000)) {
    if (R.isEmpty(tree.search(i, i + neededSpace - 1))) {
      const row = Math.floor(i / hpPerRow())
      const col = i % hpPerRow()
      return { col, row }
    }
  }

  return { col: 0, row: 0 }
}
