import React, { useEffect } from "react"
import { connect } from "react-redux"
import * as R from "ramda"
import Tone from "tone"
import { setValue } from "../../store/actions"
import Socket from "../Socket"
import Module from "../Module"
import background from "./background.svg"

export const sockets = [
  { x: 4.7, y: 56.7, name: "input1" },
  { x: 16.3, y: 56.7, name: "input2" },
  { x: 39.3, y: 56.7, name: "input4" },
  { x: 28, y: 56.7, name: "input3" },
  { x: 4.7, y: 70.7, name: "input5" },
  { x: 16.3, y: 70.7, name: "input6" },
  { x: 28, y: 70.7, name: "input7" },
  { x: 39.3, y: 70.7, name: "input8" },
  { x: 4.7, y: 93.3, name: "output1" },
  { x: 16.3, y: 93.3, name: "output2" },
  { x: 28, y: 93.3, name: "output3" },
  { x: 39.3, y: 93.3, name: "output4" },
  { x: 4.7, y: 109, name: "output5" },
  { x: 16.3, y: 109, name: "output6" },
  { x: 28, y: 109, name: "output7" },
  { x: 39.3, y: 109, name: "output8" }
]

const Audio = ({ id, col, row, volume = 0, audioNode, setValue }) => {
  useEffect(() => {
    setValue(id, "audioNode", new Tone.Oscillator().start().toMaster())
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
