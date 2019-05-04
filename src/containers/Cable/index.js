import React, { useEffect } from "react"
import { connect } from "react-redux"
import * as R from "ramda"
import Cable from "../../components/Cable"
import {
  removeConnector,
  dragConnector,
  moveConnector
} from "../../store/actions"
import { getCable } from "../../store/selectors"
import { socketToPos, getInstrument } from "../../store/selectors"

const CableContainer = ({
  id,
  disabled,
  color,
  x1,
  y1,
  x2,
  y2,
  from,
  to,
  drag,
  outputSocket,
  inputSocket,
  removeConnector,
  dragConnector,
  moveConnector
}) => {
  useEffect(() => {
    if (disabled || !from || !to) return
    if (from.numberOfOutputs === 0 || to.numberOfInputs === 0) return
    if (R.isNil(R.path(["outputs", outputSocket], from))) return
    if (R.isNil(R.path(["inputs", inputSocket], to))) return

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
  }, [disabled, from, inputSocket, outputSocket, to])

  return (
    <Cable
      id={id}
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      drag={drag}
      color={color}
      disabled={disabled}
      removeConnector={removeConnector}
      dragConnector={dragConnector}
      moveConnector={moveConnector}
    />
  )
}

const mapStateToProps = (state, { id }) => {
  const cable = getCable(id, state)
  const { outputModule, outputSocket, inputModule, inputSocket } = cable
  const fromPos = socketToPos(outputModule, "outputs", outputSocket, state)
  const toPos = socketToPos(inputModule, "inputs", inputSocket, state)
  const { x: x1, y: y1 } = R.isEmpty(fromPos) ? toPos : fromPos
  const { x: x2, y: y2 } = R.isEmpty(toPos) ? fromPos : toPos
  return {
    ...cable,
    x1,
    y1,
    x2,
    y2,
    from: getInstrument(outputModule, state),
    to: getInstrument(inputModule, state)
  }
}

const mapDispatchToProps = {
  removeConnector,
  dragConnector,
  moveConnector
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CableContainer)
