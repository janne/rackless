import React from "react"

const styles = {
  container: {
    color: "#eee"
  }
}

const RackView = ({ match }) => {
  const { uid, patchId } = match.params
  return (
    <div style={styles.container}>
      User: {uid}
      <br />
      Patch: {patchId}
    </div>
  )
}

export default RackView
