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
    const start = (output.numberOfOutputs === 1
      ? output.output
      : output.output[outputPort]
    ).start
    if (start) start()

    output.connect(input, outputNum, inputNum)
    return () => {
      const stop = (output.numberOfOutputs === 1
        ? output.output
        : output.output[outputPort]
      ).stop
      if (stop) stop()
      output.disconnect(outputNum)
    }
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

  const setPos = connector => (connector === "outputs" ? setPos1 : setPos2)

  const handleStart = connector => pos => removeConnector(id, connector, pos)

  const handleStop = connector => pos => {
    const initPos =
      connector === "outputs" ? { x: x1, y: y1 } : { x: x2, y: y2 }
    setPos(connector)(initPos)
    moveConnector(id, connector, pos)
  }

  return (
    <Fragment>
      <Connector
        x={x1}
        y={y1}
        onStart={handleStart("outputs")}
        onDrag={setPos("outputs")}
        onStop={handleStop("outputs")}
      />
      <Connector
        x={x2}
        y={y2}
        onStart={handleStart("inputs")}
        onDrag={setPos("inputs")}
        onStop={handleStop("inputs")}
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
    "outputs",
    outputSocket,
    state
  )
  const { x: x2, y: y2 } = R.isNil(inputSocket)
    ? { x: x1, y: y1 }
    : socketToPos(inputModule, "inputs", inputSocket, state)
  const from = R.path(["instruments", outputModule], state)
  const to = R.path(["instruments", inputModule], state)
  return { x1, y1, x2, y2, from, to }
}

const mapDispatchToProps = { moveConnector, removeConnector }

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Cable)
