import React, { useEffect } from "react"
import * as R from "ramda"
import Instrument from "./Instrument"
import { connect } from "react-redux"
import { setValue, setInstrument } from "../../store/actions"
import { getModule, getInstrument } from "../../store/selectors"
import Module from "../../components/Module"
import * as moduleTypes from "../../modules"

const ModuleContainer = ({ id, data, instrument, setInstrument, setValue }) => {
  const { type, values = [] } = data

  const {
    controls = [],
    inputs = [],
    outputs = [],
    setup = () => {}
  } = moduleTypes[type]

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
  }, R.keys(rangeControls).map(getValue)) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setupValues(instrument, values)
  }, R.keys(otherControls).map(getValue)) // eslint-disable-line react-hooks/exhaustive-deps

  const setupValues = (instrument, values) => {
    if (R.isNil(instrument)) return
    R.mapObjIndexed(({ range }, name) => {
      const defaultValue = R.isNil(range) ? 0.5 : 0
      const value = R.isNil(values[name]) ? defaultValue : values[name]
      instrument.controls[name].value = value
    }, controls)
  }

  return (
    <Module
      id={id}
      data={data}
      instrument={instrument}
      setInstrument={setInstrument}
      setValue={setValue}
    />
  )
}

const mapStateToProps = (state, { id }) => ({
  data: getModule(id, state),
  instrument: getInstrument(id, state)
})

const mapDispatchToProps = {
  setInstrument,
  setValue
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ModuleContainer)
