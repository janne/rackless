import React from "react"
import { connect } from "react-redux"
import * as R from "ramda"
import { DraggableCore } from "react-draggable"
import { changeTrimpot } from "../../store/actions"
import background from "./background.svg"
import { ZOOM } from "../../constants"

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
      className="draggable"
      style={{ ...styles.content, left: x * ZOOM, top: y * ZOOM }}
      onDoubleClick={dblClickHandler}
    >
      <DraggableCore onDrag={dragHandler}>
        <img
          draggable={false}
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
  value: R.path(["modules", ownProps.id, ownProps.name], state)
})

const mapDispatchToProps = { changeTrimpot }

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Trimpot)
