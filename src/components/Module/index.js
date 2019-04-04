import React, { useEffect } from "react"
import * as R from "ramda"
import Plate from "../Plate"
import Trimpot from "../Trimpot"
import Socket from "../Socket"
import Instrument from "../Instrument"

const Module = ({
  id,
  setValue,
  instrument,
  setInstrument,
  col,
  row,
  values,
  background,
  controls = [],
  inputs = [],
  outputs = [],
  setup = () => {}
}) => {
  useEffect(() => {
    setInstrument(id, new Instrument(controls, inputs, outputs, setup))
  }, [])

  useEffect(() => {
    if (R.isNil(instrument)) return
    controls.forEach(
      ({ name }) => (instrument.controls[name].value = values[name] || 0)
    )
  }, controls.map(control => values[control.name]))

  return (
    <Plate col={col} row={row} moduleId={id} background={background}>
      {controls.map((params, idx) => (
        <Trimpot
          {...params}
          id={id}
          value={values[params.name]}
          setValue={setValue}
          key={`control-${idx}`}
        />
      ))}

      {inputs.map((params, idx) => (
        <Socket
          moduleId={id}
          direction="inputs"
          key={`input-${idx}`}
          socketId={idx}
          {...params}
        />
      ))}

      {outputs.map((params, idx) => (
        <Socket
          moduleId={id}
          direction="outputs"
          key={`output-${idx}`}
          socketId={idx}
          {...params}
        />
      ))}
    </Plate>
  )
}

export default Module
