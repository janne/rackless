import React, { Fragment, useEffect } from "react"
import { connect } from "react-redux"
import * as R from "ramda"
import Tone from "tone"
import {
  setInstrument,
  fetchPatch,
  createModule,
  setLoggedIn,
  setLoading,
  toggleDelete,
  signOut
} from "./store/actions"
import { getLoggedIn, getLoading, isDeleting } from "./store/selectors"
import * as moduleTypes from "./modules"
import TopBar from "./components/TopBar"
import Loader from "./components/Loader"
import {
  initialize,
  setLoginHandler,
  getCurrentUser,
  signIn
} from "./utils/firebase"
import Rack from "./containers/Rack"

const styles = {
  content: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    top: 48,
    overflow: "scroll"
  }
}

const App = ({
  fetchPatch,
  createModule,
  signOut,
  isLoggedIn,
  setLoggedIn,
  isLoading,
  setLoading,
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

  const titleize = text => text.replace(/([A-Z])/g, " $1")

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
        handler: () => createModule(type)
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
        <Rack />
      </div>
    </Fragment>
  )
}

const mapStateToProps = state => ({
  isLoggedIn: getLoggedIn(state),
  isLoading: getLoading(state),
  deleting: isDeleting(state)
})

const mapDispatchToProps = {
  createModule,
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
