import React, { useEffect } from "react"
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
import "firebase/auth"
import "firebase/database"
import Cable from "./components/Cable"
import {
  setInstrument,
  fetchPatch,
  dispatchAndPersist,
  createModule,
  deleteModule,
  setUser,
  setDB
} from "./store/actions"
import * as moduleTypes from "./modules"
import Module from "./components/Module"

const App = ({
  fetchPatch,
  setUser,
  setDB,
  dispatchAndPersist,
  instruments = [],
  modules,
  cables
}) => {
  useEffect(() => {
    // Initialize
    firebase.initializeApp({
      apiKey: "AIzaSyAUfjY5qEoCA49XnOS9bCZ2tAoaDD5L1rQ",
      authDomain: "rackless-cc.firebaseapp.com",
      projectId: "rackless-cc",
      databaseURL: "https://rackless-cc.firebaseio.com",
      storageBucket: "rackless-cc.appspot.com"
    })

    setDB(firebase.database())

    firebase
      .auth()
      .signInAnonymously()
      .catch(error => console.error(error))
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        setUser(user.uid)
        fetchPatch()
      }
    })
  }, [])

  useEffect(() => {
    const instrumentsWithLoop = R.filter(
      i => Boolean(R.prop("loop", i)),
      instruments
    )
    const performAnimation = () => {
      if (!R.isEmpty(instrumentsWithLoop))
        requestAnimationFrame(performAnimation)
      R.forEach(instrument => {
        instrument.loopState = instrument.loop(instrument.loopState)
      }, R.values(instrumentsWithLoop))
    }
    if (!R.isEmpty(instrumentsWithLoop)) requestAnimationFrame(performAnimation)
  }, [instruments])

  const enableSound = () => {
    Tone.context.resume()
  }

  const renderModule = id => <Module id={id} />

  const renderRootMenu = () => {
    const renderModuleMenu = type => (
      <MenuItem
        key={type}
        data={{ type }}
        onClick={(e, data) => dispatchAndPersist(createModule(data.type))}
      >
        {type}
      </MenuItem>
    )
    return (
      <ContextMenu id="root-menu">
        <SubMenu title="Add module" hoverDelay={200}>
          {R.map(renderModuleMenu, R.keys(moduleTypes))}
        </SubMenu>
        <MenuItem divider />
        <MenuItem
          onClick={() => window.open("https://www.reddit.com/r/rackless")}
        >
          Open Reddit
        </MenuItem>
      </ContextMenu>
    )
  }

  const renderModuleMenu = id => (
    <ContextMenu id={`${id}-menu`}>
      <MenuItem
        data={{ id }}
        onClick={(e, data) => dispatchAndPersist(deleteModule(data.id))}
      >
        Delete
      </MenuItem>
    </ContextMenu>
  )

  return (
    <ContextMenuTrigger id="root-menu" holdToDisplay={-1}>
      <div onClick={enableSound} style={{ height: "100vh", width: "100vw" }}>
        {R.map(
          id => (
            <div key={id}>
              <ContextMenuTrigger id={`${id}-menu`} holdToDisplay={-1}>
                {renderModule(id)}
              </ContextMenuTrigger>
              {renderModuleMenu(id)}
            </div>
          ),
          R.keys(modules)
        )}
        {R.values(
          R.mapObjIndexed(
            (props, id) => <Cable key={id} id={id} {...props} />,
            cables
          )
        )}
      </div>
      {renderRootMenu()}
    </ContextMenuTrigger>
  )
}

const mapStateToProps = state => ({
  cables: R.propOr([], "cables", state),
  modules: R.propOr([], "modules", state),
  instruments: R.propOr([], "instruments", state)
})

const mapDispatchToProps = {
  dispatchAndPersist,
  setInstrument,
  fetchPatch,
  setUser,
  setDB
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
