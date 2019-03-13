import React from "react"
import { connect } from "react-redux"
import Audio from "./modules/Audio"
import VCO from "./modules/VCO"
import { moveModule } from "./store/actions"

const App = ({ moveModule }) => {
  moveModule("vco1", 200, 50)
  moveModule("vco2", 400, 50)
  moveModule("audio", 600, 50)
  return (
    <div className="content">
      <VCO id="vco1" />
      <VCO id="vco2" />
      <Audio id="audio" />
    </div>
  )
}

const mapDispatchToProps = { moveModule }

export default connect(
  null,
  mapDispatchToProps
)(App)
