import React, { useEffect, useRef } from "react"
import { connect } from "react-redux"
import * as R from "ramda"
import Tone from "tone"
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
  setLoggedIn,
  setLoading
} from "./store/actions"
import { getLoggedIn, getLoading } from "./store/selectors"
import * as moduleTypes from "./modules"
import Module from "./components/Module"
import TopBar from "./TopBar"

const styles = {
  root: {
    flexGrow: 1
  },
  rack: {
    border: "solid 1px red"
  },
  menuTitle: {
    flexGrow: 1
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  },
  loader: {
    zIndex: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    height: "100%",
    top: 0,
    left: 0,
    right: 0,
    background: "rgba(0, 0, 0, 0.9)"
  }
}

const App = ({
  fetchPatch,
  setPatch,
  isLoggedIn,
  setLoggedIn,
  isLoading,
  dispatchAndPersist,
  setLoading,
  instruments = [],
  modules,
  cables
}) => {
  useEffect(() => {
    // Initialize
    firebase.initializeApp({
      apiKey: "AIzaSyAUfjY5qEoCA49XnOS9bCZ2tAoaDD5L1rQ",
      authDomain: "www.rackless.cc",
      projectId: "rackless-cc",
      databaseURL: "https://rackless-cc.firebaseio.com",
      storageBucket: "rackless-cc.appspot.com"
    })

    Tone.context.lookAhead = 0

    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        fetchPatch(user)
      }
      setLoading(false)
      setLoggedIn(user && !user.isAnonymous)
    })
  }, [fetchPatch, setLoading, setLoggedIn])

  const removePatch = async user =>
    firebase
      .database()
      .ref(`/users/${user.uid}`)
      .remove()

  const signInHandler = async () => {
    const provider = new firebase.auth.GoogleAuthProvider()
    const { currentUser } = firebase.auth()
    if (R.isNil(currentUser)) {
      return firebase.auth().signInWithPopup(provider)
    }
    return currentUser.linkWithPopup(provider).catch(({ code, credential }) => {
      if (code === "auth/credential-already-in-use") {
        removePatch(currentUser)
        currentUser.delete()
        firebase.auth().signInAndRetrieveDataWithCredential(credential)
      }
    })
  }

  const signOutHandler = async () => {
    firebase
      .auth()
      .signOut()
      .then(() =>
        setPatch({
          isLoggedIn: false,
          modules: null,
          cables: null,
          instruments: null
        })
      )
  }

  const enableSound = () => {
    Tone.context.resume()
  }

  const renderModule = id => <Module key={id} id={id} />

  const titleize = text => text.replace(/([A-Z])/g, " $1")

  const performAnimation = useRef()
  const performLoop = useRef()

  useEffect(() => {
    performAnimation.current = () => {
      requestAnimationFrame(performAnimation.current)
      R.forEachObjIndexed((instrument, id) => {
        if (instrument.animate) instrument.animate(id)
      }, instruments)
    }

    performLoop.current = () => {
      const instrumentsWithLoop = R.filter(
        i => Boolean(R.prop("loop", i)),
        instruments
      )
      R.forEachObjIndexed((instrument, id) => {
        instrument.props = instrument.loop(
          instrument.props || {},
          modules[id].values || {}
        )
      }, instrumentsWithLoop)
    }
  }, [instruments, modules])

  useEffect(() => {
    setInterval(() => performLoop.current(), 10)
    requestAnimationFrame(performAnimation.current)
  }, [])

  const navItems = () => ({
    menu: [
      {
        title: "Open Reddit",
        handler: () => window.open("https://www.reddit.com/r/rackless")
      },
      {
        title: isLoggedIn
          ? `Log out ${firebase.auth().currentUser.displayName}`
          : "Log in",
        handler: isLoggedIn ? signOutHandler : signInHandler
      }
    ],
    add: R.map(
      type => ({
        title: titleize(type),
        handler: () => dispatchAndPersist(createModule(type))
      }),
      R.keys(moduleTypes)
    )
  })

  return (
    <div style={styles.root}>
      <TopBar items={navItems()} />
      {isLoading && (
        <div style={styles.loader}>
          <img src="spinner.gif" alt="Spinner" width="200" height="200" />
        </div>
      )}
      {R.map(id => renderModule(id), R.keys(modules))}
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
  isLoggedIn: getLoggedIn(state),
  isLoading: getLoading(state),
  cables: R.propOr([], "cables", state),
  modules: R.propOr([], "modules", state),
  instruments: R.propOr([], "instruments", state)
})

const mapDispatchToProps = {
  dispatchAndPersist,
  setInstrument,
  fetchPatch,
  setPatch,
  setLoggedIn,
  setLoading
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
