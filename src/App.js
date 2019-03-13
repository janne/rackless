import React from "react"
import Audio from "./modules/Audio"
import VCO from "./modules/VCO"
import "./App.css"

const App = () => {
  return (
    <div className="content">
      <VCO x={200} y={25} id="vco1" />
      <Audio x={600} y={25} />
    </div>
  )
}

export default App
