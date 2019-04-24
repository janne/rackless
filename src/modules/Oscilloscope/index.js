import React, { createRef } from "react"
import * as R from "ramda"
import Tone from "tone"
import background from "./background.svg"

const resolution = 512
const width = 144
const height = 144

const Component = (_, ref) => <canvas ref={ref} width={width} height={height} />

const controls = {
  aScale: { x: 10, y: 185, width: 30 },
  aPos: { x: 10, y: 233, width: 30 },
  bScale: { x: 61, y: 185, width: 30 },
  bPos: { x: 61, y: 233, width: 30 },
  cScale: { x: 112, y: 185, width: 30 },
  cPos: { x: 112, y: 233, width: 30 },
  monitor: { x: 4, y: 34, Component, ref: createRef() }
}

const inputs = {
  a: { x: 15, y: 282 },
  b: { x: 66, y: 282 },
  c: { x: 117, y: 282 }
}

const outputs = {
  a: { x: 15, y: 322 },
  b: { x: 66, y: 322 },
  c: { x: 117, y: 322 }
}

const setup = ({ inputs, outputs, controls }) => {
  const tones = {}

  const route = analyser => {
    const old = tones[analyser]
    tones[analyser] = new Tone.Analyser("waveform", resolution)
    inputs[analyser].chain(tones[analyser], outputs[analyser])
    if (old) old.dispose()
  }

  const analysers = { a: "#C4C4C4", b: "red", c: "green" }

  R.keys(analysers).forEach(analyser => {
    route(analyser)
    outputs[analyser].stop = () => route(analyser)
  })

  const dispose = () => Object.values(tones).forEach(t => t.dispose())

  const scale = (value, istart, istop, ostart, ostop) =>
    ostart + (ostop - ostart) * ((value - istart) / (istop - istart))

  const loop = () => {
    const canvas = controls.monitor.ref.current
    const context = canvas.getContext("2d")
    context.clearRect(0, 0, width, height)

    R.keys(analysers).forEach(analyser => {
      const value = tones[analyser].getValue()
      context.beginPath()
      const lineWidth = 2
      context.lineWidth = lineWidth
      const start = R.reduce(
        (prev, curr) =>
          value[prev] <= 0 && value[curr] >= 0 ? R.reduced(prev) : curr,
        0,
        R.range(0, resolution - width)
      )

      const scaler = controls[`${analyser}Scale`].value
      const pos = controls[`${analyser}Pos`].value * 2

      value.slice(start, start + width).forEach((v, i) => {
        const x = scale(i, 0, width, 0, width)
        const y = scale(-v * scaler + pos, 0, 2, 0, height)
        if (i === 0) context.moveTo(x, y)
        else context.lineTo(x, y)
      })
      context.lineCap = "round"
      context.strokeStyle = analysers[analyser]
      context.stroke()
    })
  }

  return { dispose, loop }
}

export default { controls, inputs, outputs, setup, background }
