import React, { useState } from "react"
import { connect } from "react-redux"
import Draggable from "react-draggable"
import { moveModule } from "../../store/actions"
import { HEIGHT_PIX, HP_PIX } from "../../constants"

const Module = ({ id, col, row, hp, background, children, moveModule }) => {
  const [pos] = useState({ col, row })

  const styles = {
    content: { position: "absolute" },
    background: { height: HEIGHT_PIX, width: HP_PIX * hp }
  }

  const dragHandler = (e, data) => {
    const newCol = pos.col + Math.round(data.x / HP_PIX)
    const newRow = pos.row + Math.round(data.y / HEIGHT_PIX)
    moveModule(id, newCol, newRow)
  }

  return (
    <Draggable
      grid={[HP_PIX, HEIGHT_PIX]}
      onDrag={dragHandler}
      cancel=".draggable"
    >
      <div
        onDrag={dragHandler}
        style={{
          ...styles.content,
          left: pos.col * HP_PIX,
          top: pos.row * HEIGHT_PIX
        }}
      >
        <img
          draggable={false}
          src={background}
          style={styles.background}
          alt=""
        />
        {children}
      </div>
    </Draggable>
  )
}

const mapDispatchToProps = { moveModule }

export default connect(
  null,
  mapDispatchToProps
)(Module)
