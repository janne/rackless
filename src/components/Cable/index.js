import React, { Fragment } from "react"
import { connect } from "react-redux"
import * as R from "ramda"
import { HEIGHT_PIX, HP_PIX, ZOOM, MAX_COLS, MAX_ROWS } from "../../constants"
import { sockets as socketsVCO } from "../VCO"
import { sockets as socketsAudio } from "../Audio"
import Connector from "./Connector"

const Cable = ({ x1, y1, x2, y2, color }) => {
  return (
    <div style={{ position: "absolute", pointerEvents: "none" }}>
      <svg
        width={MAX_COLS * HP_PIX}
        height={MAX_ROWS * HEIGHT_PIX}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d={`M${x1} ${y1} C ${x1} ${y1 + 10 * ZOOM}, ${x2} ${y2 +
            Math.cbrt(Math.abs(x2 - x1)) * 5 * ZOOM}, ${x2} ${y2}`}
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

const getSockets = id => {
  const [type] = R.split("::", id)
  switch (type) {
    case "vco":
      return socketsVCO
    case "audio":
      return socketsAudio
    default:
      return null
  }
}

const getSocketPos = (id, socketId, state) => {
  const { row, col } = R.pathOr({}, [id], state)
  const socket = R.find(R.propEq("name", socketId))(getSockets(id))
  return [col * HP_PIX + socket.x * ZOOM, row * HEIGHT_PIX + socket.y * ZOOM]
}

const mapStateToProps = (state, { fromId, fromSocket, toId, toSocket }) => {
  if (R.isEmpty(state)) return {}
  const [x1, y1] = getSocketPos(fromId, fromSocket, state)
  const [x2, y2] = getSocketPos(toId, toSocket, state)
  return { x1, y1, x2, y2 }
}

const CableWithConnector = ({ x1, y1, x2, y2, color }) => {
  if (R.any(R.isNil, [x1, y1, x2, y2, color])) return null
  const center = 3.3 * ZOOM
  return (
    <Fragment>
      <Cable
        x1={x1 + center}
        y1={y1 + center}
        x2={x2 + center}
        y2={y2 + center}
        color={color}
      />
      <Connector x={x1} y={y1} />
      <Connector x={x2} y={y2} />
    </Fragment>
  )
}
export default connect(mapStateToProps)(CableWithConnector)
