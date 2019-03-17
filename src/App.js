import React from "react"
import { connect } from "react-redux"
import Audio from "./components/Audio"
import VCO from "./components/VCO"
import Cable from "./components/Cable"
import Tone from "tone"

const App = ({ modules, cables }) => {
  const enableSound = () => {
    Tone.context.resume()
  }

  const renderModule = module => {
    switch (module.type) {
      case "VCO":
        return <VCO {...module.data} />
      case "AUDIO":
        return <Audio {...module.data} />
      default:
        return null
    }
  }

  return (
    <div className="content" onClick={enableSound}>
      {modules.map(mod => renderModule(mod))}
      {cables.map(props => (
        <Cable {...props} />
      ))}
    </div>
  )
}

const mapStateToProps = state => ({
  cables: state.cables,
  modules: state.modules
})

export default connect(mapStateToProps)(App)
