import React from "react"
import Audio from "./modules/Audio"
import VCO from "./modules/VCO"

const App = () => {
  return (
    <div className="content">
      <VCO x={200} y={25} id="vco1" />
      <VCO x={400} y={25} id="vco2" />
      <Audio x={600} y={25} />
    </div>
  )
}

export default App
