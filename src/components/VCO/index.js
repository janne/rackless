import React, { useEffect } from "react"
import Instrument from "./Instrument"
import background from "./background.svg"
import Plate from "../Plate"
import Trimpot from "../Trimpot"
import Socket from "../Socket"

export const pots = [
  { x: 19.33, y: 24.66, name: "freq", range: "audio" },
  { x: 35.33, y: 24.66, name: "fine", range: "audio" },
  { x: 19, y: 53.33, name: "fmcv", range: "normal" },
  { x: 19, y: 79.33, name: "pwmcv", range: "normal" },
  { x: 35, y: 79.33, name: "pwidth", range: "audio" }
]

export const input = [
  { x: 4.33, y: 27.33, name: "voct", socketId: 0, range: "normal" },
  { x: 4.33, y: 56, name: "fm", socketId: 1, range: "audio" },
  { x: 4.33, y: 82, name: "pwm", socketId: 2, range: "normal" }
]

export const output = [
  { x: 4.33, y: 106.66, name: "sin", socketId: 0, range: "frequency" }, // sin
  { x: 15.66, y: 106.66, name: "tri", socketId: 1, range: "frequency" }, // tri
  { x: 27, y: 106.66, name: "saw", socketId: 2, range: "frequency" }, // saw
  { x: 38, y: 106.66, name: "sqr", socketId: 3, range: "frequency" } // sqr
]

export const module = ({ id, setValue, col, row, values }) => {
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
    <Plate col={col} row={row} hp={10} moduleId={id} background={background}>
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
