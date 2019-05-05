import * as R from "ramda"
import IntervalTree from "node-interval-tree"
import { HP_PIX, HEIGHT_PIX } from "../constants"
import * as moduleTypes from "../modules"

const WIDTH = 15

export const getData = R.propOr({}, "data")

export const getCurrent = R.path(["data", "current"])

export const getPatches = R.path(["data", "patches"])

export const getModules = state =>
  R.pathOr({}, ["data", "patches", getCurrent(state), "modules"], state)
export const getModule = (moduleId, state) =>
  R.pathOr(
    {},
    ["data", "patches", getCurrent(state), "modules", moduleId],
    state
  )

export const getCables = state =>
  R.pathOr({}, ["data", "patches", getCurrent(state), "cables"], state)
export const getCable = (cableId, state) =>
  R.pathOr({}, ["data", "patches", getCurrent(state), "cables", cableId], state)

export const getInstruments = R.propOr({}, "instruments")
export const getInstrument = (moduleId, state) =>
  R.path(["instruments", moduleId], state)

export const getLoggedIn = R.prop("isLoggedIn")

export const getLoading = R.prop("isLoading")

export const getSockets = (moduleId, direction, state) => {
  const type = getModule(moduleId, state).type
  return R.pathOr([], [type, direction], moduleTypes)
}

export const socketToPos = (moduleId, direction, socketId, state) => {
  if (R.isNil(moduleId) || R.isNil(socketId)) return {}
  const { row, col } = getModule(moduleId, state)
  const socket = getSockets(moduleId, direction, state)[socketId]
  if (R.isNil(socket)) return {}
  return {
    x: col * HP_PIX + socket.x,
    y: row * HEIGHT_PIX + socket.y
  }
}

export const socketAtPos = ({ x, y }, direction, state) => {
  for (let moduleId of R.keys(getModules(state))) {
    const { col, row } = getModule(moduleId, state)
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
    R.values(R.mapObjIndexed((m, id) => ({ ...m, id }), getModules(state)))
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
    R.values(getModules(state))
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

export const isDeleting = state => R.propOr(false, "deleting", state)
