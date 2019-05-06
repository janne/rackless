import React from "react"

const styles = {
  container: {
    color: "#eee"
  }
}

const RackView = ({ match }) => {
  const { uid, pid } = match.params
  return (
    <div style={styles.container}>
      User: -{uid}
      <br />
      Patch: -{pid}
    </div>
  )
}

export default RackView
