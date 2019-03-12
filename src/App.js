import React from "react"
import Tone from "tone"
import Audio from "./modules/Audio"
import VCO from "./modules/VCO"
import "./App.css"

const App = () => {
  new Tone.Oscillator().start().toMaster()

  return (
    <div className="content">
      <Audio x={600} y={25} />
      <VCO x={200} y={25} id="vco" />
    </div>
  )
}

export default App
