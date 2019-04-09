import React, { useEffect } from "react"
import * as R from "ramda"
import Plate from "./Plate"
import Trimpot from "./Trimpot"
import Switch from "./Switch"
import Socket from "./Socket"
import Instrument from "./Instrument"

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
  const [rangeControls, otherControls] = R.partition(
    R.compose(
      R.is(Array),
      R.prop("range")
    ),
    controls
  )

  useEffect(() => {
    const instrument = new Instrument(controls, inputs, outputs, setup, values)
    setInstrument(id, instrument)
    setupValues(instrument, values)
    return () => instrument.dispose()
  }, rangeControls.map(control => values[control.name]))

  useEffect(() => {
    setupValues(instrument, values)
  }, otherControls.map(control => values[control.name]))

  const setupValues = (instrument, values) => {
    if (R.isNil(instrument)) return
    controls.forEach(
      ({ name }) => (instrument.controls[name].value = values[name] || 0)
    )
  }

  return (
    <Plate col={col} row={row} moduleId={id} background={background}>
      {controls.map((params, idx) => {
        if (R.is(Array, params.range)) {
          return (
            <Switch
              {...params}
              id={id}
              value={values[params.name]}
              setValue={setValue}
              key={`control-${idx}`}
            />
          )
        }
        return (
          <Trimpot
            {...params}
            id={id}
            value={values[params.name]}
            setValue={setValue}
            key={`control-${idx}`}
          />
        )
      })}

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
