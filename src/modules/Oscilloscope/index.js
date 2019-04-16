import React from "react"
import * as R from "ramda"
import Tone from "tone"
import background from "./background.svg"

const resolution = 512
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
  const tones = {}

  const route = analyser => {
    const old = tones[analyser]
    tones[analyser] = new Tone.Analyser("waveform", resolution)
    inputs[analyser].chain(tones[analyser], outputs[analyser])
    if (old) old.dispose()
  }

  const analysers = { a: "white", b: "red", c: "green", d: "blue" }

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
      value.slice(start, start + width).forEach((v, i) => {
        const x = scale(i, 0, width, 0, width)
        const y = scale(v, -1, 1, 0, height)
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
