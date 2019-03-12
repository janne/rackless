import React, { Component } from "react"
import logo from "./logo.svg"
import Tone from "tone"
import "./App.css"

class App extends Component {
  state = { synth: new Tone.DuoSynth().toMaster() }

  playTone = () => {
    this.state.synth.triggerAttackRelease("C4", "8n")
  }

  render() {
    return (
      <div className="App" onMouseDown={this.playTone}>
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    )
  }
}

export default App
