import React, { Fragment, useEffect, useRef } from "react"
import { connect } from "react-redux"
import * as R from "ramda"
import Tone from "tone"
import Cable from "./components/Cable"
import {
  setInstrument,
  fetchPatch,
  dispatchAndPersist,
  createModule,
  setLoggedIn,
  setLoading,
  toggleDelete,
  signOut
} from "./store/actions"
import { getLoggedIn, getLoading, isDeleting } from "./store/selectors"
import * as moduleTypes from "./modules"
import Module from "./components/Module"
import TopBar from "./components/TopBar"
import Loader from "./components/Loader"
import {
  initialize,
  setLoginHandler,
  getCurrentUser,
  signIn
} from "./utils/firebase"

const styles = {
  content: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    top: 48,
    overflow: "scroll"
  },
  menuTitle: {
    flexGrow: 1
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  }
}

const App = ({
  fetchPatch,
  signOut,
  isLoggedIn,
  setLoggedIn,
  isLoading,
  dispatchAndPersist,
  setLoading,
  instruments = [],
  modules,
  cables,
  toggleDelete,
  deleting
}) => {
  useEffect(() => {
    initialize()

    Tone.context.lookAhead = 0

    setLoginHandler(user => {
      if (user) {
        fetchPatch(user)
      }
      setLoading(false)
      setLoggedIn(user && !user.isAnonymous)
    })
  }, [fetchPatch, setLoading, setLoggedIn])

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
          ? `Log out ${R.propOr("", "displayName", getCurrentUser())}`
          : "Log in",
        handler: isLoggedIn ? signOut : signIn
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
    <Fragment>
      <TopBar
        items={navItems()}
        deleteHandler={toggleDelete}
        deleting={deleting}
      />
      <div style={styles.content}>
        {isLoading && <Loader />}
        {R.map(id => renderModule(id), R.keys(modules))}
        {R.values(
          R.mapObjIndexed(
            (props, id) => <Cable key={id} id={id} {...props} />,
            cables
          )
        )}
      </div>
    </Fragment>
  )
}

const mapStateToProps = state => ({
  isLoggedIn: getLoggedIn(state),
  isLoading: getLoading(state),
  cables: R.propOr([], "cables", state),
  modules: R.propOr([], "modules", state),
  instruments: R.propOr([], "instruments", state),
  deleting: isDeleting(state)
})

const mapDispatchToProps = {
  dispatchAndPersist,
  setInstrument,
  fetchPatch,
  setLoggedIn,
  setLoading,
  toggleDelete,
  signOut
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
