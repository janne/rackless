import React from "react"
import { connect } from "react-redux"
import * as R from "ramda"
import { DraggableCore } from "react-draggable"
import { setValue } from "../../store/actions"
import background from "./background.svg"
import { ZOOM } from "../../constants"

const Trimpot = ({
  x,
  y,
  id,
  width = 10,
  range = "normal",
  name,
  value = 0,
  setValue
}) => {
  const styles = {
    content: { position: "absolute" }
  }

  const dragHandler = e => {
    setValue(
      id,
      name,
      R.clamp(
        range === "normal" ? 0 : -1,
        1,
        value + (e.movementX - e.movementY) / 300
      )
    )
    e.preventDefault()
  }

  const dblClickHandler = e => setValue(id, name, 0)

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
            transform: `rotate(${
              range === "normal" ? (value - 0.5) * 300 : value * 150
            }deg)`
          }}
          alt="Trimpot"
        />
      </DraggableCore>
    </div>
  )
}

const mapStateToProps = (state, { id, name }) => ({
  value: R.path(["modules", id, name], state)
})

const mapDispatchToProps = { setValue }

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Trimpot)
