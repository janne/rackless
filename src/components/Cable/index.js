import React, { Fragment, useState, useEffect } from "react"
import { connect } from "react-redux"
import * as R from "ramda"
import { ZOOM } from "../../constants"
import { moveConnector, removeConnector } from "../../store/actions"
import { socketToPos } from "../../store/selectors"
import Connector from "./Connector"
import Bezier from "./Bezier"

const CENTER = 3.3 * ZOOM

const Cable = ({
  id,
  x1,
  y1,
  x2,
  y2,
  color,
  moveConnector,
  removeConnector,
  from,
  to,
  outputSocket,
  inputSocket,
  disabled
}) => {
  if (R.any(i => isNaN(i), [x1, y1, x2, y2])) return null
  const [pos1, setPos1] = useState({ x: x1, y: y1 })
  const [pos2, setPos2] = useState({ x: x2, y: y2 })

  useEffect(() => {
    setPos1({ x: x1, y: y1 })
    setPos2({ x: x2, y: y2 })
  }, [x1, y1, x2, y2])

  const connect = (output, outputPort, input, inputPort) => {
    if (output.numberOfOutputs === 0 || input.numberOfInputs === 0) return
    const outputNum =
      Number(outputPort) < output.numberOfOutputs ? Number(outputPort) : 0
    const inputNum =
      Number(inputPort) < input.numberOfInputs ? Number(inputPort) : 0
    output.connect(input, outputNum, inputNum)
    return () => output.disconnect(outputNum)
  }

  useEffect(() => {
    if (disabled || !from || !to) return

    return connect(
      from,
      outputSocket,
      to,
      inputSocket
    )
  })

  const setPos = connector => (connector === "output" ? setPos1 : setPos2)

  const handleStart = connector => pos => removeConnector(id, connector, pos)

  const handleStop = connector => pos => {
    const initPos = connector === "output" ? { x: x1, y: y1 } : { x: x2, y: y2 }
    setPos(connector)(initPos)
    moveConnector(id, connector, pos)
  }

  return (
    <Fragment>
      <Connector
        x={x1}
        y={y1}
        onStart={handleStart("output")}
        onDrag={setPos("output")}
        onStop={handleStop("output")}
      />
      <Connector
        x={x2}
        y={y2}
        onStart={handleStart("input")}
        onDrag={setPos("input")}
        onStop={handleStop("input")}
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

const mapStateToProps = (
  state,
  { outputModule, outputSocket, inputModule, inputSocket }
) => {
  const { x: x1, y: y1 } = socketToPos(
    outputModule,
    "output",
    outputSocket,
    state
  )
  const { x: x2, y: y2 } = R.isNil(inputSocket)
    ? { x: x1, y: y1 }
    : socketToPos(inputModule, "input", inputSocket, state)
  const from = R.path([outputModule, "instrument"], state.modules)
  const to = R.path([inputModule, "instrument"], state.modules)
  return { x1, y1, x2, y2, from, to }
}

const mapDispatchToProps = { moveConnector, removeConnector }

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Cable)
