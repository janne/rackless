import React from "react"
import Audio from "./components/Audio"
import VCO from "./components/VCO"
import Cable from "./components/Cable"

const App = () => {
  return (
    <div className="content">
      <VCO id="vco1" col={12} row={0} />
      <VCO id="vco2" col={0} row={0} />
      <Audio id="audio" col={24} row={0} />
      <Cable id="patch1" x1={225} y1={400} x2={625} y2={235} color="red" />
      <Cable id="patch2" x1={425} y1={400} x2={660} y2={235} color="green" />
    </div>
  )
}

export default App
