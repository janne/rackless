import React, { useEffect, useState } from "react"
import { BrowserRouter as Router, Route } from "react-router-dom"
import { connect } from "react-redux"
import { getLoading } from "./store/selectors"
import Loader from "./components/Loader"
import { initialize } from "./utils/firebase"
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

const App = ({ isLoading }) => {
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    initialize()
    setInitialized(true)
  }, [])

  return (
    <Router>
      <TopBar />
      <div style={styles.content}>
        {isLoading && <Loader />}
        {initialized && <Route exact path="/" component={Rack} />}
        {initialized && (
          <Route path="/:uid(\w{28}):patchId(-\w{19})" component={Rack} />
        )}
      </div>
    </Router>
  )
}

const mapStateToProps = state => ({
  isLoading: getLoading(state)
})

export default connect(mapStateToProps)(App)
