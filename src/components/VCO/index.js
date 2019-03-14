import React, { useEffect } from "react"
import { connect } from "react-redux"
import * as R from "ramda"
import { createOscillator } from "../../store/actions"
import background from "./background.svg"
import Module from "../Module"
import Trimpot from "../Trimpot"
import Socket from "../Socket"

export const pots = [
  { x: 20.5, y: 20, name: "frequency" },
  { x: 9.3, y: 48.3, name: "fine" },
  { x: 33.3, y: 48.3, name: "pulseWnameth" },
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
  col,
  row,
  id,
  createOscillator,
  oscillator,
  frequency = 0,
  fine = 0
}) => {
  useEffect(() => {
    createOscillator(id)
  }, [])

  if (oscillator) oscillator.frequency.value = 440 + frequency * 10 + fine

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

const mapStateToProps = (state, ownProps) => ({
  oscillator: R.path([ownProps.id, "oscillator"], state),
  frequency: R.path([ownProps.id, "frequency", "value"], state),
  fine: R.path([ownProps.id, "fine", "value"], state)
})

const mapDispatchToProps = { createOscillator }

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(VCO)