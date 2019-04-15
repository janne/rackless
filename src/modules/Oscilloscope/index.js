import React from "react"
import * as R from "ramda"
import Tone from "tone"
import background from "./background.svg"

const width = 144
const height = 144

const Component = (_, ref) => <canvas ref={ref} width={width} height={height} />

const controls = {
  select: { x: 11, y: 201 },
  left: { x: 58, y: 201 },
  right: { x: 105, y: 201 },
  monitor: { x: 4, y: 38, Component }
}

const inputs = {
  a: { x: 15, y: 264 },
  b: { x: 49, y: 264 },
  c: { x: 83, y: 264 },
  d: { x: 117, y: 264 }
}

const outputs = {
  a: { x: 15, y: 309 },
  b: { x: 49, y: 309 },
  c: { x: 83, y: 309 },
  d: { x: 117, y: 309 }
}

const setup = ({ inputs, outputs, controls }) => {
  const tones = {
    analyserA: new Tone.Analyser("waveform", 256),
    analyserB: new Tone.Analyser("waveform", 256),
    analyserC: new Tone.Analyser("waveform", 256),
    analyserD: new Tone.Analyser("waveform", 256)
  }

  inputs.a.chain(tones.analyserA, outputs.a)
  inputs.b.chain(tones.analyserB, outputs.b)
  inputs.c.chain(tones.analyserC, outputs.c)
  inputs.d.chain(tones.analyserD, outputs.d)

  const dispose = () => Object.values(tones).forEach(t => t.dispose())

  const scale = (value, istart, istop, ostart, ostop) =>
    ostart + (ostop - ostart) * ((value - istart) / (istop - istart))

  const loop = () => {
    const canvas = controls.monitor.ref.current
    const context = canvas.getContext("2d")
    const value = tones.analyserA.getValue()
    context.clearRect(0, 0, width, height)
    context.beginPath()
    const lineWidth = 2
    context.lineWidth = lineWidth
    let start = 0
    value.slice(start, 128).forEach((v, i) => {
      const x = scale(i, 0, 128, 0, width)
      const y = scale(v, -1, 1, 0, height)
      if (i === 0) context.moveTo(x, y)
      else context.lineTo(x, y)
    })
    context.lineCap = "round"
    context.strokeStyle = "white"
    context.stroke()
  }

  return { dispose, loop }
}

export default { controls, inputs, outputs, setup, background }
