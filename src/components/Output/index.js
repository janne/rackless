import React, { useEffect } from "react"
import { connect } from "react-redux"
import * as R from "ramda"
import Tone from "tone"
import { setValue } from "../../store/actions"
import Socket from "../Socket"
import Plate from "../Plate"
import Trimpot from "../Trimpot"
import background from "./background.svg"

export const pots = [
  { x: 19.33, y: 13.66, name: "volume", range: "normal" },
  { x: 19.33, y: 35.33, name: "level1", range: "normal" },
  { x: 35.33, y: 35.33, name: "pan1", range: "audio" },
  { x: 19.33, y: 59, name: "level2", range: "normal" },
  { x: 35.33, y: 58.66, name: "pan2", range: "audio" },
  { x: 35.33, y: 89.66, name: "pan3", range: "audio" }
]

export const sockets = [
  { x: 4.5, y: 38, name: "i1" },
  { x: 4.5, y: 61.33, name: "i2" },
  { x: 4.5, y: 83, name: "i3l" },
  { x: 4.5, y: 101.33, name: "i3r" },
  { x: 20.66, y: 92.33, name: "pancv" }
]

const Output = ({ id, col, row, volume = 0, audioNode, setValue }) => {
  useEffect(() => {
    setValue(id, "audioNode", Tone.Master)
  }, [])
  useEffect(() => {
    if (audioNode) audioNode.volume.value = volume
  }, [volume])

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
  R.pick(["audioNode", "volume"], R.path(["modules", id], state))

const mapDispatchToProps = { setValue }

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Output)
