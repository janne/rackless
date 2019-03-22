import React, { useEffect } from "react"
import { connect } from "react-redux"
import * as R from "ramda"
import Tone from "tone"
import { setValue } from "../../store/actions"
import Socket from "../Socket"
import Module from "../Module"
import background from "./background.svg"

export const sockets = [
  { x: 4.7, y: 56.7, name: "i0" },
  { x: 16.3, y: 56.7, name: "i1" },
  { x: 28, y: 56.7, name: "i2" },
  { x: 39.3, y: 56.7, name: "i3" },
  { x: 4.7, y: 70.7, name: "i4" },
  { x: 16.3, y: 70.7, name: "i5" },
  { x: 28, y: 70.7, name: "i6" },
  { x: 39.3, y: 70.7, name: "i7" },
  { x: 4.7, y: 93.3, name: "o0" },
  { x: 16.3, y: 93.3, name: "o1" },
  { x: 28, y: 93.3, name: "o2" },
  { x: 39.3, y: 93.3, name: "o3" },
  { x: 4.7, y: 109, name: "o4" },
  { x: 16.3, y: 109, name: "o5" },
  { x: 28, y: 109, name: "o6" },
  { x: 39.3, y: 109, name: "o7" }
]

const Audio = ({ id, col, row, volume = 0, audioNode, setValue }) => {
  useEffect(() => {
    setValue(id, "audioNode", Tone.Master)
  }, [])
  useEffect(() => {
    if (audioNode) audioNode.volume.value = volume
  }, [volume])

  return (
    <Module id={id} col={col} row={row} hp={10} background={background}>
      {sockets.map(params => (
        <Socket {...params} id={id} key={params.name} />
      ))}
    </Module>
  )
}

const mapStateToProps = (state, { id }) =>
  R.pick(["audioNode", "volume"], R.path(["modules", id], state))

const mapDispatchToProps = { setValue }

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Audio)
