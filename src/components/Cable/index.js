import React, { Fragment, useState, useEffect } from "react"
import { connect } from "react-redux"
import * as R from "ramda"
import {
  HEIGHT_PIX,
  HP_PIX,
  ZOOM,
  MAX_COLS,
  MAX_ROWS,
  CABLE_SLACK
} from "../../constants"
import { sockets as socketsVCO } from "../VCO"
import { sockets as socketsAudio } from "../Audio"
import Connector from "./Connector"

const Cable = ({ x1, y1, x2, y2, color }) => {
  const hang = Math.cbrt(Math.abs(x2 - x1)) * CABLE_SLACK
  return (
    <div style={{ position: "absolute", pointerEvents: "none" }}>
      <svg
        width={MAX_COLS * HP_PIX}
        height={MAX_ROWS * HEIGHT_PIX}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d={`M${x1} ${y1} C ${x1} ${y1 + hang}, ${x2} ${y2 +
            hang}, ${x2} ${y2}`}
          stroke={color}
          strokeWidth={3 * ZOOM}
          opacity={0.8}
          strokeLinecap="round"
          fill="transparent"
        />
      </svg>
    </div>
  )
}

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

const mapStateToProps = (state, { fromId, fromSocket, toId, toSocket }) => {
  if (R.isEmpty(state)) return {}
  const [x1, y1] = getSocketPos(fromId, fromSocket, state)
  const [x2, y2] = getSocketPos(toId, toSocket, state)
  return { x1, y1, x2, y2 }
}

const CableWithConnector = ({ x1, y1, x2, y2, color }) => {
  if (R.any(i => isNaN(i), [x1, y1, x2, y2])) return null
  const [pos1, setPos1] = useState({ x: x1, y: y1 })
  const [pos2, setPos2] = useState({ x: x2, y: y2 })
  useEffect(() => {
    setPos1({ x: x1, y: y1 })
  }, [x1, y1])
  useEffect(() => {
    setPos2({ x: x2, y: y2 })
  }, [x2, y2])

  const center = 3.3 * ZOOM
  return (
    <Fragment>
      <Connector
        x={x1}
        y={y1}
        onDrag={setPos1}
        onStop={() => setPos1({ x: x1, y: y1 })}
      />
      <Connector
        x={x2}
        y={y2}
        onDrag={setPos2}
        onStop={() => setPos2({ x: x2, y: y2 })}
      />
      <Cable
        x1={pos1.x + center}
        y1={pos1.y + center}
        x2={pos2.x + center}
        y2={pos2.y + center}
        color={color}
      />
    </Fragment>
  )
}
export default connect(mapStateToProps)(CableWithConnector)
