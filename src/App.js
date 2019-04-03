import React, { useEffect } from "react"
import { connect } from "react-redux"
import * as R from "ramda"
import Cable from "./components/Cable"
import { setValue, loadPatch } from "./store/actions"
import Tone from "tone"
import modules from "./modules"
import Module from "./components/Module"
import firebase from "firebase/app"
import "firebase/firestore"

const App = props => {
  useEffect(() => {
    firebase.initializeApp({
      apiKey: "AIzaSyAUfjY5qEoCA49XnOS9bCZ2tAoaDD5L1rQ",
      authDomain: "rackless-cc.firebaseapp.com",
      projectId: "rackless-cc"
    })
    const db = firebase.firestore()
    props.loadPatch(db, "A3ukO7yv7XzgZsb1Ve7T")
  }, [])

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

const mapDispatchToProps = { setValue, loadPatch }

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
