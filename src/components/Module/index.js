import React, { useEffect } from "react"
import Plate from "../Plate"
import Trimpot from "../Trimpot"
import Socket from "../Socket"
import Instrument from "../Instrument"

const Module = ({
  id,
  setValue,
  col,
  row,
  values,
  background,
  pots = [],
  inputs = [],
  outputs = [],
  setup = () => {}
}) => {
  useEffect(() => {
    setValue(id, "instrument", new Instrument(pots, inputs, outputs, setup))
  }, [])

  useEffect(() => {
    if (!values.instrument) return
    pots.forEach(
      ({ name }) => (values.instrument.pots[name].value = values[name] || 0)
    )
  }, pots.map(pot => values[pot.name]))

  return (
    <Plate col={col} row={row} moduleId={id} background={background}>
      {pots.map(params => (
        <Trimpot
          {...params}
          id={id}
          value={values[params.name]}
          setValue={setValue}
          key={params.name}
        />
      ))}

      {inputs.map(params => (
        <Socket
          moduleId={id}
          direction="inputs"
          key={`input-${params.socketId}`}
          {...params}
        />
      ))}

      {outputs.map(params => (
        <Socket
          moduleId={id}
          direction="outputs"
          key={`output-${params.socketId}`}
          {...params}
        />
      ))}
    </Plate>
  )
}

export default Module
