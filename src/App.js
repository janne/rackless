import React, { useEffect, useRef } from "react"
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
  setPatch,
  dispatchAndPersist,
  createModule,
  deleteModule,
  setLoggedIn
} from "./store/actions"
import { getLoggedIn } from "./store/selectors"
import * as moduleTypes from "./modules"
import Module from "./components/Module"

const styles = {
  container: {
    height: "100vh",
    width: "100vw"
  }
}

const App = ({
  fetchPatch,
  setPatch,
  isLoggedIn,
  setLoggedIn,
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

    Tone.context.lookAhead = 0

    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        console.log(
          `Fetching patch for ${user.isAnonymous ? "anonymous " : ""}user:`,
          user.uid
        )
        fetchPatch(user)
      }
    })
  }, [])

  const removePatch = async user =>
    firebase
      .database()
      .ref(`/users/${user.uid}`)
      .remove()

  const mergeAnonymousUser = (prevUser, googleCredential) => {
    removePatch(prevUser)
    firebase
      .auth()
      .signInAndRetrieveDataWithCredential(googleCredential)
      .then(user => {
        user
          .delete()
          .then(() =>
            prevUser.linkAndRetrieveDataWithCredential(googleCredential)
          )
          .then(() =>
            firebase
              .auth()
              .signInAndRetrieveDataWithCredential(googleCredential)
          )
      })
  }

  const signInHandler = async () => {
    const provider = new firebase.auth.GoogleAuthProvider()
    const { currentUser } = firebase.auth()
    if (R.isNil(currentUser)) {
      return firebase
        .auth()
        .signInWithPopup(provider)
        .then(({ user }) => {
          console.log("Logged in with Google:", user.uid)
          setLoggedIn(true)
        })
    }
    return currentUser
      .linkWithPopup(provider)
      .then(({ user }) => {
        setLoggedIn(true)
        console.log("Linked with Google", user.uid)
      })
      .catch(({ code, credential }) => {
        if (code === "auth/credential-already-in-use") {
          console.log(`Merging user ${currentUser.uid} with Google`)
          mergeAnonymousUser(currentUser, credential)
        }
      })
  }

  const signOutHandler = async () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        console.log("User signed out")
        setPatch({
          isLoggedIn: false,
          modules: null,
          cables: null,
          instruments: null
        })
      })
  }

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
        <MenuItem
          onClick={() => window.open("https://www.reddit.com/r/rackless")}
        >
          Open Reddit
        </MenuItem>
        <MenuItem divider />
        {!isLoggedIn && <MenuItem onClick={signInHandler}>Log in</MenuItem>}
        {isLoggedIn && (
          <MenuItem onClick={signOutHandler}>
            Log out {firebase.auth().currentUser.displayName}
          </MenuItem>
        )}
        <MenuItem onClick={signOutHandler}>Log out anonymous</MenuItem>
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

  const performAnimation = useRef()

  useEffect(() => {
    performAnimation.current = () => {
      requestAnimationFrame(performAnimation.current)
      const instrumentsWithLoop = R.filter(
        i => Boolean(R.prop("loop", i)),
        instruments
      )
      if (!R.isEmpty(instrumentsWithLoop)) {
        R.forEachObjIndexed((instrument, id) => {
          instrument.props = instrument.loop(
            instrument.props || {},
            modules[id].values || {}
          )
        }, instrumentsWithLoop)
      }
    }
  }, [instruments, modules])

  useEffect(() => {
    requestAnimationFrame(performAnimation.current)
  }, [])

  return (
    <ContextMenuTrigger id="root-menu" holdToDisplay={-1}>
      <div onClick={enableSound} style={styles.container}>
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
  isLoggedIn: getLoggedIn(state),
  cables: R.propOr([], "cables", state),
  modules: R.propOr([], "modules", state),
  instruments: R.propOr([], "instruments", state)
})

const mapDispatchToProps = {
  dispatchAndPersist,
  setInstrument,
  fetchPatch,
  setPatch,
  setLoggedIn
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
