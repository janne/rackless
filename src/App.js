import React, { Fragment, useEffect } from "react"
import { connect } from "react-redux"
import { fetchPatch, setLoggedIn, setLoading } from "./store/actions"
import { getLoading } from "./store/selectors"
import Loader from "./components/Loader"
import { initialize, setLoginHandler } from "./utils/firebase"
import TopBar from "./containers/TopBar"
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

const App = ({ fetchPatch, setLoggedIn, isLoading, setLoading }) => {
  useEffect(() => {
    initialize()

    setLoginHandler(user => {
      if (user) {
        fetchPatch(user)
      }
      setLoading(false)
      setLoggedIn(user && !user.isAnonymous)
    })
  }, [fetchPatch, setLoading, setLoggedIn])

  return (
    <Fragment>
      <TopBar />
      <div style={styles.content}>
        {isLoading && <Loader />}
        <Rack />
      </div>
    </Fragment>
  )
}

const mapStateToProps = state => ({
  isLoading: getLoading(state)
})

const mapDispatchToProps = {
  fetchPatch,
  setLoggedIn,
  setLoading
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
