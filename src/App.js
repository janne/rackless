import React, { useState } from "react"
import Tone from "tone"
import Audio from "./modules/audio"
import VCO from "./modules/vco"
import "./App.css"

const App = () => {
  new Tone.Oscillator().start().toMaster()

  return (
    <div className="content">
      <Audio left={600} />
      <VCO left={200} />
    </div>
  )
}

export default App
