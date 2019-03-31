import React from "react"
import { connect } from "react-redux"
import * as R from "ramda"
import Cable from "./components/Cable"
import { setValue } from "./store/actions"
import Tone from "tone"
import moduleTypes from "./moduleTypes"
import Module from "./components/Module"

const App = ({ modules, cables, setValue }) => {
  const enableSound = () => {
    Tone.context.resume()
  }

  const renderModule = (id, { type, col, row, ...values }) => {
    const { background, pots, input, output, Instrument } = R.prop(
      type,
      moduleTypes
    )
    if (!Instrument) return null
    return (
      <Module
        background={background}
        pots={pots}
        input={input}
        output={output}
        Instrument={Instrument}
        id={id}
        setValue={setValue}
        col={col}
        row={row}
        values={values}
      />
    )
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
