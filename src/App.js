import React from "react"
import Audio from "./components/Audio"
import VCO from "./components/VCO"
import Cable from "./components/Cable"

const App = () => {
  return (
    <div className="content">
      <VCO id="vco::1" col={12} row={0} />
      <VCO id="vco::2" col={1} row={0} />
      <Audio id="audio::1" col={23} row={0} />
      <Cable
        id="patch::1"
        fromId="vco::1"
        fromSocket="sin"
        toId="audio::1"
        toSocket="input1"
        color="red"
      />
      <Cable
        id="patch::2"
        fromId="vco::2"
        fromSocket="sin"
        toId="audio::1"
        toSocket="input2"
        color="green"
      />
    </div>
  )
}

export default App
