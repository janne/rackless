import React, { useEffect } from "react"
import Instrument from "./Instrument"
import { connect } from "react-redux"
import * as R from "ramda"
import { setValue } from "../../store/actions"
import background from "./background.svg"
import Module from "../Module"
import Trimpot from "../Trimpot"
import Socket from "../Socket"

const BASE_FREQ = 440

export const pots = [
  { x: 20.5, y: 20, name: "frequency", range: "audio" },
  { x: 9.3, y: 48.3, name: "fine", range: "audio" },
  { x: 33.3, y: 48.3, name: "pWidth", range: "audio" },
  { x: 9.3, y: 70, name: "fmCv" },
  { x: 33.3, y: 70, name: "pwmCv" }
]

export const sockets = [
  { x: 4.3, y: 93.3, name: "i0" }, // voct
  { x: 16, y: 93.3, name: "i1" }, // fm
  { x: 27.7, y: 93.3, name: "i2" }, // sync
  { x: 39.3, y: 93.3, name: "i3" }, // pwm
  { x: 4.3, y: 108.3, name: "o0" }, // sin
  { x: 16, y: 108.3, name: "o1" }, // tri
  { x: 27.7, y: 108.3, name: "o2" }, // saw
  { x: 39.3, y: 108.3, name: "o3" } // sqr
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
    setValue(id, "audioNode", new Instrument({ frequency: BASE_FREQ }))
  }, [])
  useEffect(() => {
    if (!audioNode) return
    const freqValue = BASE_FREQ * Math.pow(2, frequency * 4)
    const fineValue = (freqValue / 2) * fine
    audioNode.frequency.value = freqValue + fineValue
  }, [frequency, fine])

  return (
    <Module col={col} row={row} hp={10} id={id} background={background}>
      {pots.map(params => (
        <Trimpot {...params} id={id} key={params.name} />
      ))}

      {sockets.map(params => (
        <Socket {...params} id={id} key={params.name} />
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
