import React, { useState } from "react"
import { connect } from "react-redux"
import * as R from "ramda"
import { DraggableCore } from "react-draggable"
import { changeTrimpot } from "../../store/actions"
import background from "./background.svg"
import { ZOOM } from "../../constants"

const dragImg = new Image(0, 0)
dragImg.src =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
dragImg.style.display = "none"

const Trimpot = ({ x, y, id, width = 10, name, value = 0, changeTrimpot }) => {
  const styles = {
    content: { position: "absolute" }
  }

  const dragHandler = e => {
    changeTrimpot(id, name, value + (e.movementX - e.movementY) / 3)
    e.preventDefault()
  }

  const dblClickHandler = e => changeTrimpot(id, name, 0)

  return (
    <div
      style={{ ...styles.content, left: x * ZOOM, top: y * ZOOM }}
      onDoubleClick={dblClickHandler}
    >
      <DraggableCore onDrag={dragHandler}>
        <img
          src={background}
          style={{
            ...styles.img,
            width: width * ZOOM,
            transform: `rotate(${value * 10}deg)`
          }}
          alt="Trimpot"
        />
      </DraggableCore>
    </div>
  )
}

const mapStateToProps = (state, ownProps) => ({
  value: R.path([ownProps.id, ownProps.name, "value"], state)
})

const mapDispatchToProps = { changeTrimpot }

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Trimpot)
