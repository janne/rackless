import React, { useEffect } from "react"
import { connect } from "react-redux"
import * as R from "ramda"
import Instrument from "./Instrument"
import { setValue } from "../../store/actions"
import Socket from "../Socket"
import Plate from "../Plate"
import Trimpot from "../Trimpot"
import background from "./background.svg"

export const pots = [
  { x: 19.33, y: 13.66, name: "gain", range: "normal" },
  { x: 19.33, y: 35.33, name: "level1", range: "normal" },
  { x: 35.33, y: 35.33, name: "pan1", range: "audio" },
  { x: 19.33, y: 59, name: "level2", range: "normal" },
  { x: 35.33, y: 58.66, name: "pan2", range: "audio" },
  { x: 19.3, y: 94, name: "level3", range: "normal" }
]

export const sockets = [
  { x: 4.5, y: 38, name: "i0" },
  { x: 4.5, y: 61.33, name: "i1" },
  { x: 4.5, y: 86.33, name: "i2" },
  { x: 4.5, y: 104.66, name: "i3" },
  { x: 37.5, y: 80.5, name: "i4" }
]

const Output = ({
  id,
  col,
  row,
  gain = 0,
  level1 = 0,
  pan1 = 0,
  level2 = 0,
  pan2 = 0,
  level3 = 0,
  audioNode,
  setValue
}) => {
  useEffect(() => {
    setValue(id, "audioNode", new Instrument())
  }, [])

  useEffect(() => {
    if (!audioNode) return
    audioNode.gain.value = gain
    audioNode.level1.value = level1
    audioNode.pan1.value = pan1
    audioNode.level2.value = level2
    audioNode.pan2.value = pan2
    audioNode.level3.value = level3
  }, [gain, level1, pan1, level2, pan2, level3])

  return (
    <Plate id={id} col={col} row={row} hp={10} background={background}>
      {pots.map(params => (
        <Trimpot {...params} id={id} key={params.name} />
      ))}

      {sockets.map(params => (
        <Socket {...params} id={id} key={params.name} />
      ))}
    </Plate>
  )
}

const mapStateToProps = (state, { id }) =>
  R.pick(
    ["audioNode", "gain", "level1", "pan1", "level2", "pan2", "level3"],
    R.path(["modules", id], state)
  )

const mapDispatchToProps = { setValue }

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Output)
