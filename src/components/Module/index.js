import React, { useEffect } from "react"
import Plate from "../Plate"
import Trimpot from "../Trimpot"
import Socket from "../Socket"

const Module = ({
  id,
  setValue,
  col,
  row,
  values,
  background,
  pots = [],
  input = [],
  output = [],
  Instrument
}) => {
  useEffect(() => {
    setValue(id, "instrument", new Instrument(pots, input, output))
  }, [])

  useEffect(() => {
    if (!values.instrument) return
    pots.forEach(
      ({ name }) => (values.instrument[name].value = values[name] || 0)
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

      {input.map(params => (
        <Socket
          moduleId={id}
          direction="input"
          key={`input-${params.socketId}`}
          {...params}
        />
      ))}

      {output.map(params => (
        <Socket
          moduleId={id}
          direction="output"
          key={`output-${params.socketId}`}
          {...params}
        />
      ))}
    </Plate>
  )
}

export default Module
