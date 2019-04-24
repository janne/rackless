import React, { useEffect, useRef } from "react"
import { connect } from "react-redux"
import * as R from "ramda"
import Plate from "./Plate"
import Trimpot from "./Trimpot"
import Switch from "./Switch"
import Socket from "./Socket"
import Instrument from "./Instrument"
import {
  setValue,
  setInstrument,
  dispatchAndPersist
} from "../../store/actions"
import * as moduleTypes from "../../modules"

const Wrapper = ({ x, y, children }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y
    }}
  >
    {children}
  </div>
)

const Module = ({
  id,
  instrument,
  setInstrument,
  data,
  dispatchAndPersist
}) => {
  const { col, row, type, values = [] } = data
  const {
    background,
    controls = [],
    inputs = [],
    outputs = [],
    setup = () => {}
  } = moduleTypes[type]

  const controlsWithRefs = R.map(
    control => ({
      ...control,
      ref: useRef() // eslint-disable-line react-hooks/rules-of-hooks
    }),
    controls
  )

  const [rangeControls, otherControls] = R.partition(
    R.compose(
      R.is(Array),
      R.prop("range")
    ),
    controls
  )

  const getValue = R.flip(R.prop)(values)

  useEffect(() => {
    const instrument = new Instrument(
      controlsWithRefs,
      inputs,
      outputs,
      setup,
      values
    )
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

  const dispatchedSetValue = (id, name, value) =>
    dispatchAndPersist(setValue(id, name, value))

  return (
    <Plate col={col} row={row} moduleId={id} background={background}>
      {R.values(
        R.mapObjIndexed((params, name) => {
          const { Component, x, y } = params
          if (Component) {
            const ComponentWithRef = React.forwardRef(Component)
            const props = R.propOr({}, "props", instrument)
            return (
              <Wrapper x={x} y={y} key={`control-${name}`}>
                <ComponentWithRef
                  id={id}
                  name={name}
                  value={values[name]}
                  setValue={dispatchedSetValue}
                  {...params}
                  {...props}
                />
              </Wrapper>
            )
          }
          if (R.is(Array, params.range)) {
            return (
              <Wrapper x={x} y={y} key={`control-${name}`}>
                <Switch
                  {...params}
                  id={id}
                  name={name}
                  value={values[name]}
                  setValue={dispatchedSetValue}
                />
              </Wrapper>
            )
          }
          return (
            <Wrapper x={x} y={y} key={`control-${name}`}>
              <Trimpot
                {...params}
                id={id}
                name={name}
                value={values[name]}
                setValue={dispatchedSetValue}
              />
            </Wrapper>
          )
        }, controlsWithRefs)
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

const mapStateToProps = (state, { id }) => ({
  data: R.path(["modules", id], state),
  instrument: R.path(["instruments", id], state)
})

const mapDispatchToProps = {
  setInstrument,
  dispatchAndPersist
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Module)
