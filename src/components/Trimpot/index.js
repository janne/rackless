import React, { useState } from "react"
import { connect } from "react-redux"
import * as R from "ramda"
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

  const [dragPos, setDragPos] = useState(null)

  const dragStartHandler = e => {
    setDragPos({ x: e.pageX, y: e.pageY, value })
    e.dataTransfer.setDragImage(dragImg, 0, 0)
  }

  const dragEndHandler = e => setDragPos(null)

  const dragHandler = e => {
    if (e.pageX) {
      const newValue =
        dragPos.value + (e.pageX - dragPos.x + (dragPos.y - e.pageY)) / 10
      if (value !== newValue) changeTrimpot(id, name, newValue)
    }
    e.stopPropagation()
  }

  const dblClickHandler = e => changeTrimpot(id, name, 0)

  return (
    <div style={{ ...styles.content, left: x * ZOOM, top: y * ZOOM }}>
      <img
        onDrag={dragHandler}
        onDragEnd={dragEndHandler}
        onDragStart={dragStartHandler}
        onDoubleClick={dblClickHandler}
        src={background}
        style={{
          ...styles.img,
          width: width * ZOOM,
          transform: `rotate(${value * 10}deg)`
        }}
        alt="Trimpot"
      />
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