import React from "react"
import { connect } from "react-redux"
import * as R from "ramda"
import Output from "./components/Output"
import VCO from "./components/VCO"
import Cable from "./components/Cable"
import { setValue } from "./store/actions"
import Tone from "tone"

const App = ({ modules, cables, setValue }) => {
  const enableSound = () => {
    Tone.context.resume()
  }

  const renderModule = (id, { type, col, row, ...values }) => {
    switch (type) {
      case "VCO":
        return (
          <VCO
            id={id}
            setValue={setValue}
            col={col}
            row={row}
            values={values}
          />
        )
      case "OUTPUT":
        return (
          <Output
            id={id}
            setValue={setValue}
            col={col}
            row={row}
            values={values}
          />
        )
      default:
        return null
    }
  }

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

const mapDispatchToProps = { setValue }

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
