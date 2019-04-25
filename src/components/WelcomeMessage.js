import React, { useState, useEffect } from "react"

const styles = {
  message: {
    margin: 10,
    textTransform: "uppercase",
    fontSize: 9,
    color: "#c0c0c0"
  }
}

const WelcomeMessage = ({ enabled }) => {
  const [show, setShow] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      if (enabled) setShow(true)
    }, 2000)
  })

  if (!enabled || !show) return null

  return (
    <div style={styles.message}>
      {"ontouchstart" in window ? "Long press" : "Right click"} to start
    </div>
  )
}

export default WelcomeMessage
