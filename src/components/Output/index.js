import React, { useEffect } from "react"
import Instrument from "./Instrument"
import Socket from "../Socket"
import Plate from "../Plate"
import Trimpot from "../Trimpot"
import background from "./background.svg"

export const pots = [
  { x: 19.33, y: 13.66, name: "gain", range: "normal" },
  { x: 19.33, y: 35.33, name: "level1", range: "normal" },
  { x: 35.33, y: 35.33, name: "pan1", range: "audio" },
  { x: 19.33, y: 59, name: "level2", range: "normal" },
  { x: 35.33, y: 58.66, name: "pan2", range: "audio" },
  { x: 19.3, y: 94, name: "level3", range: "normal" }
]

export const input = [
  { x: 4.5, y: 38, name: "i1", socketId: 0, range: "audio" },
  { x: 4.5, y: 61.33, name: "i2", socketId: 1, range: "audio" },
  { x: 4.5, y: 86.33, name: "i3l", socketId: 2, range: "audio" },
  { x: 4.5, y: 104.66, name: "i3r", socketId: 3, range: "audio" },
  { x: 37.5, y: 80.5, name: "pancv", socketId: 4, range: "audio" }
]

export const module = ({ id, setValue, col, row, values }) => {
  useEffect(() => {
    setValue(id, "instrument", new Instrument(pots, input))
  }, [])

  useEffect(() => {
    if (!values.instrument) return
    pots.forEach(
      ({ name }) => (values.instrument[name].value = values[name] || 0)
    )
  }, pots.map(pot => values[pot.name]))

  return (
    <Plate moduleId={id} col={col} row={row} hp={10} background={background}>
      {pots.map(params => (
        <Trimpot
          {...params}
          id={id}
          value={values[params.name]}
          setValue={setValue}
          key={params.name}
        />
      ))}

      {input.map((params, idx) => (
        <Socket
          moduleId={id}
          direction="input"
          key={`input-${idx}`}
          {...params}
        />
      ))}
    </Plate>
  )
}
