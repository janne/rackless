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
  useEffect(() => {
    if (disabled || !from || !to) return
    if (from.numberOfOutputs === 0 || to.numberOfInputs === 0) return

    const outputNum =
      from.numberOfOutputs === 1
        ? 0
        : R.findIndex(o => o === from.outputs[outputSocket], from.output)
    const inputNum =
      to.numberOfInputs === 1
        ? 0
        : R.findIndex(o => o === to.inputs[inputSocket], to.input)

    const output =
      from.numberOfOutputs === 1 ? from.output : from.outputs[outputSocket]
    if (output.start) output.start()

    from.connect(to, outputNum, inputNum)

    return () => {
      if (R.isNil(from.output)) return
      if (output.stop) output.stop()
      from.disconnect(outputNum)
    }
  }, [from, to, outputSocket, inputSocket, disabled])

  if (R.any(i => isNaN(i), [x1, y1, x2, y2])) return null

  const outX = R.prop("connector", drag) === "outputs" ? drag.pos.x : x1
  const outY = R.prop("connector", drag) === "outputs" ? drag.pos.y : y1
  const inX = R.prop("connector", drag) === "inputs" ? drag.pos.x : x2
  const inY = R.prop("connector", drag) === "inputs" ? drag.pos.y : y2

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
        disabled={disabled}
      />
      <Connector
        x={inX}
        y={inY}
        onStart={handleStart("inputs")}
        onDrag={handleDrag("inputs")}
        onStop={handleStop("inputs")}
        disabled={disabled}
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
  const fromPos = socketToPos(outputModule, "outputs", outputSocket, state)
  const toPos = socketToPos(inputModule, "inputs", inputSocket, state)

  const from = R.path(["instruments", outputModule], state)
  const to = R.path(["instruments", inputModule], state)
  const drag = R.path(["cables", id, "drag"], state)
  const { x: x1, y: y1 } = R.isEmpty(fromPos) ? toPos : fromPos
  const { x: x2, y: y2 } = R.isEmpty(toPos) ? fromPos : toPos
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
