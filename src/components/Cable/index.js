import React, { Fragment } from "react"
import * as R from "ramda"
import { moveConnector } from "../../store/actions"
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

export default Cable
