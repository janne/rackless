import React from "react"

const styles = {
  content: { position: "absolute" },
  background: { height: 400 }
}

const Module = ({ x, y, background, children }) => {
  return (
    <div style={{ ...styles.content, left: x, top: y }}>
      <img src={background} style={styles.background} alt="" />
      {children}
    </div>
  )
}

export default Module
