import React from "react"
import { connect } from "react-redux"
import * as R from "ramda"
import Cable from "./components/Cable"
import { setValue } from "./store/actions"
import Tone from "tone"
import modules from "./modules"
import Module from "./components/Module"

const App = props => {
  const enableSound = () => {
    Tone.context.resume()
  }

  const renderModule = (id, { type, col, row, ...values }) => {
    const moduleProps = R.prop(type, modules)
    return (
      <Module
        id={id}
        setValue={props.setValue}
        col={col}
        row={row}
        values={values}
        {...moduleProps}
      />
    )
  }

  return (
    <div className="content" onClick={enableSound}>
      {R.values(
        R.mapObjIndexed(
          (data, id) => <div key={id}>{renderModule(id, data)}</div>,
          props.modules
        )
      )}
      {R.values(
        R.mapObjIndexed(
          (props, id) => <Cable key={id} id={id} {...props} />,
          props.cables
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
