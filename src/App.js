import React, { useEffect } from "react"
import { connect } from "react-redux"
import Audio from "./modules/Audio"
import VCO from "./modules/VCO"
import Cable from "./modules/Cable"
import { moveModule } from "./store/actions"

const App = ({ moveModule }) => {
  useEffect(() => {
    moveModule("vco1", 200, 50)
    moveModule("vco2", 400, 50)
    moveModule("audio", 600, 50)
  }, [])

  return (
    <div className="content">
      <VCO id="vco1" />
      <VCO id="vco2" />
      <Audio id="audio" />
      <Cable id="patch1" x1={225} y1={400} x2={625} y2={235} />
    </div>
  )
}

const mapDispatchToProps = { moveModule }

export default connect(
  null,
  mapDispatchToProps
)(App)
