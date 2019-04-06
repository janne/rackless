import React, { useEffect, Fragment } from "react"
import { connect } from "react-redux"
import * as R from "ramda"
import Tone from "tone"
import {
  ContextMenu,
  MenuItem,
  SubMenu,
  ContextMenuTrigger
} from "react-contextmenu"
import firebase from "firebase/app"
import "firebase/database"
import Cable from "./components/Cable"
import {
  setValue,
  setInstrument,
  fetchPatch,
  dispatchAndPersist
} from "./store/actions"
import * as moduleTypes from "./modules"
import Module from "./components/Module"

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

  const handleClick = (e, data) => {
    console.log(data.action, data.type)
  }

  const renderModuleMenu = type => (
    <MenuItem data={{ action: "addModule", type }} onClick={handleClick}>
      {type}
    </MenuItem>
  )

  return (
    <Fragment>
      <ContextMenuTrigger id="root-menu" holdToDisplay={500}>
        <div onClick={enableSound} style={{ height: "100vh", width: "100vw" }}>
          {R.values(
            R.mapObjIndexed(
              (data, id) => (
                <div key={id}>
                  <ContextMenuTrigger id={`${id}-menu`} holdToDisplay={500}>
                    {renderModule(id, data)}
                  </ContextMenuTrigger>
                  <ContextMenu id={`${id}-menu`}>
                    <MenuItem
                      data={{ action: "removeModule", id }}
                      onClick={handleClick}
                    >
                      Delete
                    </MenuItem>
                  </ContextMenu>
                </div>
              ),
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
      </ContextMenuTrigger>
      <ContextMenu id="root-menu">
        <SubMenu title="Add module">
          {renderModuleMenu("Oscillator")}
          {renderModuleMenu("Noise")}
          {renderModuleMenu("Filter")}
          {renderModuleMenu("Output")}
        </SubMenu>
      </ContextMenu>
    </Fragment>
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
