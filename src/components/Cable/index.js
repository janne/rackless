import React, { Fragment, useState, useEffect } from "react"
import { connect } from "react-redux"
import * as R from "ramda"
import { HEIGHT_PIX, HP_PIX, ZOOM } from "../../constants"
import { destroyCable } from "../../store/actions"
import { sockets as socketsVCO } from "../VCO"
import { sockets as socketsAudio } from "../Audio"
import Connector from "./Connector"
import Bezier from "./Bezier"

const CENTER = 3.3 * ZOOM

const getSockets = (id, state) => {
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

const getSocketPos = (id, socketId, state) => {
  const { row, col } = R.pathOr({}, [id], state)
  const socket = R.find(R.propEq("name", socketId))(getSockets(id, state))
  return [col * HP_PIX + socket.x * ZOOM, row * HEIGHT_PIX + socket.y * ZOOM]
}

const Cable = ({ id, x1, y1, x2, y2, color, destroyCable }) => {
  if (R.any(i => isNaN(i), [x1, y1, x2, y2])) return null
  const [pos1, setPos1] = useState({ x: x1, y: y1 })
  const [pos2, setPos2] = useState({ x: x2, y: y2 })

  useEffect(() => {
    setPos1({ x: x1, y: y1 })
    setPos2({ x: x2, y: y2 })
  }, [x1, y1, x2, y2])

  return (
    <Fragment>
      <Connector
        x={x1}
        y={y1}
        onDrag={setPos1}
        onStop={() => destroyCable(id)}
      />
      <Connector
        x={x2}
        y={y2}
        onDrag={setPos2}
        onStop={() => destroyCable(id)}
      />
      <Bezier
        x1={pos1.x + CENTER}
        y1={pos1.y + CENTER}
        x2={pos2.x + CENTER}
        y2={pos2.y + CENTER}
        color={color}
      />
    </Fragment>
  )
}

const mapStateToProps = (state, { fromId, fromSocket, toId, toSocket }) => {
  const [x1, y1] = getSocketPos(fromId, fromSocket, state)
  const [x2, y2] = getSocketPos(toId, toSocket, state)
  return { x1, y1, x2, y2 }
}

const mapDispatchToProps = { destroyCable }

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Cable)
