import React, { useEffect } from "react"
import { connect } from "react-redux"
import * as R from "ramda"
import Cable from "./components/Cable"
import {
  setValue,
  setInstrument,
  fetchPatch,
  dispatchAndPersist
} from "./store/actions"
import Tone from "tone"
import moduleTypes from "./modules"
import Module from "./components/Module"
import firebase from "firebase/app"
import "firebase/database"

const App = ({
  fetchPatch,
  dispatchAndPersist,
  setInstrument,
  instruments,
  modules,
  cables
}) => {
  useEffect(() => {
    firebase.initializeApp({
      apiKey: "AIzaSyAUfjY5qEoCA49XnOS9bCZ2tAoaDD5L1rQ",
      authDomain: "rackless-cc.firebaseapp.com",
      projectId: "rackless-cc",
      databaseURL: "https://rackless-cc.firebaseio.com",
      storageBucket: "rackless-cc.appspot.com"
    })
    const db = firebase.database()
    fetchPatch(db, "A3ukO7yv7XzgZsb1Ve7T")
  }, [])

  const enableSound = () => {
    Tone.context.resume()
  }

  const renderModule = (id, { type, col, row, ...values }) => (
    <Module
      id={id}
      setValue={(id, name, value) =>
        dispatchAndPersist(setValue(id, name, value))
      }
      setInstrument={setInstrument}
      col={col}
      row={row}
      instrument={instruments[id]}
      values={values}
      {...moduleTypes[type]}
    />
  )

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
  cables: R.propOr([], "cables", state),
  modules: R.propOr([], "modules", state),
  instruments: R.propOr([], "instruments", state)
})

const mapDispatchToProps = { dispatchAndPersist, setInstrument, fetchPatch }

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
