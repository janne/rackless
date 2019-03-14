import React, { useState, useEffect } from "react"
import { connect } from "react-redux"
import * as R from "ramda"
import { moveModule } from "../../store/actions"

const HEIGHT_MM = 128.5
const HP_MM = 5.08
const ZOOM = 3
const HEIGHT_PIX = HEIGHT_MM * ZOOM
const HP_PIX = HP_MM * ZOOM

const dragImg = new Image(0, 0)
dragImg.src =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
dragImg.style.display = "none"

const Module = ({ id, col, row, hp, background, children, moveModule }) => {
  useEffect(() => {
    moveModule(id, col, row)
  }, [])

  const styles = {
    content: { position: "absolute" },
    background: { height: HEIGHT_PIX, width: HP_MM * hp * ZOOM }
  }

  const x = col * HP_PIX
  const y = row * HEIGHT_PIX

  const [dragPos, setDragPos] = useState(null)

  const dragStartHandler = e => {
    setDragPos({ x: e.pageX - x, y: e.pageY - y })
    e.dataTransfer.setDragImage(dragImg, 0, 0)
  }

  const dragEndHandler = e => setDragPos(null)

  const dragHandler = e => {
    const newCol = Math.floor((e.pageX - dragPos.x) / HP_PIX)
    const newRow = Math.floor((e.pageY - dragPos.y) / HEIGHT_PIX)
    if (e.pageX && e.pageY && (col !== newCol || row !== newRow)) {
      moveModule(id, newCol, newRow)
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
    col: R.pathOr(ownProps.col, [ownProps.id, "col"], state),
    row: R.pathOr(ownProps.row, [ownProps.id, "row"], state)
  }
}

const mapDispatchToProps = { moveModule }

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Module)
