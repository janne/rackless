import React, { Fragment, useState, useEffect } from "react"
import { connect } from "react-redux"
import * as R from "ramda"
import { ZOOM } from "../../constants"
import { moveConnector } from "../../store/actions"
import { socketToPos } from "../../store/selectors"
import Connector from "./Connector"
import Bezier from "./Bezier"

const CENTER = 3.3 * ZOOM

const Cable = ({ id, x1, y1, x2, y2, color, moveConnector }) => {
  if (R.any(i => isNaN(i), [x1, y1, x2, y2])) return null
  const [pos1, setPos1] = useState({ x: x1, y: y1 })
  const [pos2, setPos2] = useState({ x: x2, y: y2 })

  useEffect(() => {
    setPos1({ x: x1, y: y1 })
    setPos2({ x: x2, y: y2 })
  }, [x1, y1, x2, y2])

  const handleStop = connector => pos => {
    moveConnector(id, connector, pos)
  }

  return (
    <Fragment>
      <Connector x={x1} y={y1} onDrag={setPos1} onStop={handleStop(1)} />
      <Connector x={x2} y={y2} onDrag={setPos2} onStop={handleStop(2)} />
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
  const { x: x1, y: y1 } = socketToPos(fromId, fromSocket, state)
  const { x: x2, y: y2 } = socketToPos(toId, toSocket, state)
  return { x1, y1, x2, y2 }
}

const mapDispatchToProps = { moveConnector }

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Cable)
