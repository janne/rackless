import React, { useEffect } from "react"
import Tone from "tone"
import { connect } from "react-redux"
import * as R from "ramda"
import { setValue } from "../../store/actions"
import background from "./background.svg"
import Module from "../Module"
import Trimpot from "../Trimpot"
import Socket from "../Socket"

export const pots = [
  { x: 20.5, y: 20, name: "frequency" },
  { x: 9.3, y: 48.3, name: "fine" },
  { x: 33.3, y: 48.3, name: "pWidth" },
  { x: 9.3, y: 70, name: "fmCv" },
  { x: 33.3, y: 70, name: "pwmCv" }
]

export const sockets = [
  { x: 4.3, y: 93.3, name: "voct" },
  { x: 16, y: 93.3, name: "fm" },
  { x: 27.7, y: 93.3, name: "sync" },
  { x: 39.3, y: 93.3, name: "pwm" },
  { x: 4.3, y: 108.3, name: "sin" },
  { x: 16, y: 108.3, name: "tri" },
  { x: 27.7, y: 108.3, name: "saw" },
  { x: 39.3, y: 108.3, name: "sqr" }
]

const VCO = ({
  audioNode,
  col,
  row,
  id,
  setValue,
  frequency = 0,
  fine = 0
}) => {
  useEffect(() => {
    setValue(id, "audioNode", new Tone.Oscillator().start().toMaster())
  }, [])
  useEffect(() => {
    if (audioNode) audioNode.frequency.value = 440 + frequency + fine
  }, [frequency, fine])

  return (
    <Module col={col} row={row} hp={10} id={id} background={background}>
      {pots.map(params => (
        <Trimpot {...params} id={id} name={params.name} key={params.name} />
      ))}

      {sockets.map(params => (
        <Socket {...params} id={id} name={params.name} key={params.name} />
      ))}
    </Module>
  )
}

const mapStateToProps = (state, { id }) =>
  R.pick(["audioNode", "frequency"], R.path(["modules", id], state))

const mapDispatchToProps = { setValue }

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(VCO)
