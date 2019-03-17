import React from "react"
import { connect } from "react-redux"
import background from "./background.svg"
import { ZOOM } from "../../constants"
import { createCableFrom } from "../../store/actions"
const uuidv1 = require("uuid/v1")

const styles = {
  content: { position: "absolute" },
  background: { width: 6.7 * ZOOM }
}

const Socket = ({ x, y, id, name, createCableFrom }) => {
  const newCable = () => {
    createCableFrom(`patch::${uuidv1()}`, id, name, "purple")
  }
  return (
    <div
      className="draggable"
      style={{ ...styles.content, left: x * ZOOM, top: y * ZOOM }}
    >
      <img
        draggable={false}
        src={background}
        style={styles.background}
        alt="Socket"
        onClick={newCable}
      />
    </div>
  )
}

const mapDispatchToProps = { createCableFrom }

export default connect(
  null,
  mapDispatchToProps
)(Socket)
