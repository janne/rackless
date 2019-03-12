import React, { useState } from "react"
import Tone from "tone"
import "./App.css"

const App = () => {
  const [synth] = useState(new Tone.DuoSynth().toMaster())
  const playTone = () => synth.triggerAttackRelease("C4", "8n")

  return <div className="content" onMouseDown={playTone} />
}

export default App
