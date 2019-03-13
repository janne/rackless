import React, { useState } from "react"
import { connect } from "react-redux"
import * as R from "ramda"
import { moveModule } from "../../store/actions"

const styles = {
  content: { position: "absolute" },
  background: { height: 400 }
}

const dragImg = new Image(0, 0)
dragImg.src =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
dragImg.style.display = "none"

const Module = ({ id, x, y, background, children, moveModule }) => {
  const [dragPos, setDragPos] = useState(null)

  const dragStartHandler = e => {
    setDragPos({ x: e.pageX - x, y: e.pageY - y })
    e.dataTransfer.setDragImage(dragImg, 0, 0)
  }

  const dragEndHandler = e => setDragPos(null)

  const dragHandler = e => {
    const newX = Math.floor((e.pageX - dragPos.x) / 50) * 50
    const newY = Math.floor((e.pageY - dragPos.y) / 50) * 50
    if (e.pageX && e.pageY && (x !== newX || y !== newY)) {
      moveModule(id, newX, newY)
    }
  }

  return (
    <div
      draggable={true}
      onDragStart={dragStartHandler}
      onDragEnd={dragEndHandler}
      onDrag={dragHandler}
      style={{ ...styles.content, left: x, top: y }}
    >
      <img
        draggable={false}
        src={background}
        style={styles.background}
        alt=""
      />
      {children}
    </div>
  )
}

const mapStateToProps = (state, ownProps) => {
  return {
    x: R.pathOr(0, [ownProps.id, "x"], state),
    y: R.pathOr(0, [ownProps.id, "y"], state)
  }
}

const mapDispatchToProps = { moveModule }

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Module)
