import React, { Fragment, useEffect } from "react"
import { connect } from "react-redux"
import * as R from "ramda"
import {
  moveConnector,
  removeConnector,
  dragConnector,
  dispatchAndPersist
} from "../../store/actions"
import { socketToPos } from "../../store/selectors"
import Connector from "./Connector"
import Bezier from "./Bezier"

const CENTER = 10

const Cable = ({
  id,
  x1,
  y1,
  x2,
  y2,
  drag,
  color,
  from,
  to,
  outputSocket,
  inputSocket,
  disabled,
  removeConnector,
  dragConnector,
  dispatchAndPersist
}) => {
  if (R.any(i => isNaN(i), [x1, y1, x2, y2])) return null

  const outX = R.prop("connector", drag) === "outputs" ? drag.pos.x : x1
  const outY = R.prop("connector", drag) === "outputs" ? drag.pos.y : y1
  const inX = R.prop("connector", drag) === "inputs" ? drag.pos.x : x2
  const inY = R.prop("connector", drag) === "inputs" ? drag.pos.y : y2

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
      if (R.isNil(output.output)) return
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

  const handleStart = connector => pos => removeConnector(id, connector, pos)

  const handleDrag = connector => pos => dragConnector(id, connector, pos)

  const handleStop = connector => pos =>
    dispatchAndPersist(moveConnector(id, connector, pos))

  return (
    <Fragment>
      <Connector
        x={outX}
        y={outY}
        onStart={handleStart("outputs")}
        onDrag={handleDrag("outputs")}
        onStop={handleStop("outputs")}
      />
      <Connector
        x={inX}
        y={inY}
        onStart={handleStart("inputs")}
        onDrag={handleDrag("inputs")}
        onStop={handleStop("inputs")}
      />
      <Bezier
        x1={outX + CENTER}
        y1={outY + CENTER}
        x2={inX + CENTER}
        y2={inY + CENTER}
        color={color}
      />
    </Fragment>
  )
}

const mapStateToProps = (
  state,
  { outputModule, outputSocket, inputModule, inputSocket, id }
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
  const drag = R.path(["cables", id, "drag"], state)
  return { x1, y1, x2, y2, from, to, drag }
}

const mapDispatchToProps = {
  removeConnector,
  dragConnector,
  dispatchAndPersist
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Cable)
