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

export const sockets = [
  { x: 4.33, y: 27.33, name: "i0" }, // voct
  { x: 4.33, y: 56, name: "i1" }, // fm
  { x: 4.33, y: 82, name: "i3" }, // pwm
  { x: 4.33, y: 106.66, name: "o0" }, // sin
  { x: 15.66, y: 106.66, name: "o1" }, // tri
  { x: 27, y: 106.66, name: "o2" }, // saw
  { x: 38, y: 106.66, name: "o3" } // sqr
]

const VCO = ({
  id,
  setValue,
  audioNode,
  col,
  row,
  freq = 0,
  fine = 0,
  pwidth = 0,
  fmcv = 0,
  pwmcv = 0
}) => {
  useEffect(() => {
    setValue(id, "audioNode", new Instrument())
  }, [])

  useEffect(() => {
    if (!audioNode) return
    audioNode.freq.value = freq
    audioNode.fine.value = fine
    audioNode.pwidth.value = pwidth
    audioNode.fmcv.value = fmcv
    audioNode.pwmcv.value = pwmcv
  }, [freq, fine, pwidth, fmcv, pwmcv])

  return (
    <Plate col={col} row={row} hp={10} id={id} background={background}>
      {pots.map(params => (
        <Trimpot {...params} id={id} key={params.name} />
      ))}

      {sockets.map(params => (
        <Socket {...params} id={id} key={params.name} />
      ))}
    </Plate>
  )
}

export default VCO
