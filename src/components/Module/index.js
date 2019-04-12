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

  const getValue = R.flip(R.prop)(values)

  useEffect(() => {
    const instrument = new Instrument(controls, inputs, outputs, setup, values)
    setInstrument(id, instrument)
    setupValues(instrument, values)
    return () => instrument.dispose()
  }, R.keys(rangeControls).map(getValue))

  useEffect(() => {
    setupValues(instrument, values)
  }, R.keys(otherControls).map(getValue))

  const setupValues = (instrument, values) => {
    if (R.isNil(instrument)) return
    R.mapObjIndexed(({ range }, name) => {
      const defaultValue = range === "normal" ? 0.5 : 0
      const value = R.isNil(values[name]) ? defaultValue : values[name]
      instrument.controls[name].value = value
    }, controls)
  }

  return (
    <Plate col={col} row={row} moduleId={id} background={background}>
      {R.values(
        R.mapObjIndexed((params, name) => {
          if (R.is(Array, params.range)) {
            return (
              <Switch
                {...params}
                id={id}
                name={name}
                value={values[name]}
                setValue={setValue}
                key={`control-${name}`}
              />
            )
          }
          return (
            <Trimpot
              {...params}
              id={id}
              name={name}
              value={values[name]}
              setValue={setValue}
              key={`control-${name}`}
            />
          )
        }, controls)
      )}

      {R.values(
        R.mapObjIndexed(
          (params, name) => (
            <Socket
              moduleId={id}
              direction="inputs"
              key={`input-${name}`}
              socketId={name}
              {...params}
            />
          ),
          inputs
        )
      )}

      {R.values(
        R.mapObjIndexed(
          (params, name) => (
            <Socket
              moduleId={id}
              direction="outputs"
              key={`output-${name}`}
              socketId={name}
              {...params}
            />
          ),
          outputs
        )
      )}
    </Plate>
  )
}

export default Module
