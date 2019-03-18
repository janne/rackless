import React, { useState, useEffect } from "react"
import { connect } from "react-redux"
import * as R from "ramda"
import Audio from "./components/Audio"
import VCO from "./components/VCO"
import Cable from "./components/Cable"
import Tone from "tone"

const App = ({ modules, cables }) => {
  const enableSound = () => {
    Tone.context.resume()
  }

  const renderModule = (id, { type, ...props }) => {
    switch (type) {
      case "VCO":
        return <VCO id={id} {...props} />
      case "AUDIO":
        return <Audio id={id} {...props} />
      default:
        return null
    }
  }

  const [synth, setSynth] = useState({})

  useEffect(() => {
    setSynth(
      R.mapObjIndexed(({ type, ...props }, id) => {
        switch (type) {
          case "VCO":
            const mod = synth[id] || new Tone.Oscillator().start()
            mod.frequency.value =
              440 + R.propOr(0, "frequency", props) + R.propOr(0, "fine", props)
            return mod
          case "AUDIO":
            return synth[id] || Tone.Master
          default:
            return null
        }
      }, modules)
    )
  }, [modules])

  useEffect(() => {
    R.map(mod => {
      if (!mod.isMaster) mod.disconnect()
    }, synth)
    R.map(data => {
      const from = synth[data.fromId]
      const to = synth[data.toId]
      if (from && to) from.connect(to)
    }, cables)
  }, [cables, synth])

  return (
    <div className="content" onClick={enableSound}>
      {R.values(
        R.mapObjIndexed(
          (data, id) => <div key={id}>{renderModule(id, data)}</div>,
          modules
        )
      )}
      {R.values(
        R.mapObjIndexed(
          (props, id) => <Cable key={id} id={id} {...props} />,
          cables
        )
      )}
    </div>
  )
}

const mapStateToProps = state => ({
  cables: state.cables,
  modules: state.modules
})

export default connect(mapStateToProps)(App)
