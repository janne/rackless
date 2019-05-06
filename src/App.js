import React, { useEffect } from "react"
import { BrowserRouter as Router, Route } from "react-router-dom"
import { connect } from "react-redux"
import { fetchData, setLoggedIn, setLoading } from "./store/actions"
import { getLoading } from "./store/selectors"
import Loader from "./components/Loader"
import { initialize, setLoginHandler } from "./utils/firebase"
import TopBar from "./containers/TopBar"
import Rack from "./containers/Rack"
import RackView from "./containers/RackView"

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

const App = ({ fetchData, setLoggedIn, isLoading, setLoading }) => {
  useEffect(() => {
    initialize()

    setLoginHandler(user => {
      if (user) {
        fetchData(user)
      }
      setLoading(false)
      setLoggedIn(Boolean(user && !user.isAnonymous))
    })
  }, [fetchData, setLoading, setLoggedIn])

  return (
    <Router>
      <TopBar />
      <div style={styles.content}>
        {isLoading && <Loader />}
        <Route exact path="/" component={Rack} />
        <Route path="/:uid(\w{28}):pid(-\w{19})" component={RackView} />
      </div>
    </Router>
  )
}

const mapStateToProps = state => ({
  isLoading: getLoading(state)
})

const mapDispatchToProps = {
  fetchData,
  setLoggedIn,
  setLoading
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
