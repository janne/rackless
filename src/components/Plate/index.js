import React, { useState } from "react"
import { connect } from "react-redux"
import Draggable from "react-draggable"
import { dispatchAndPersist, moveModule } from "../../store/actions"
import { HEIGHT_PIX, HP_PIX } from "../../constants"

const Plate = ({
  moduleId,
  col,
  row,
  background,
  children,
  dispatchAndPersist
}) => {
  const [pos] = useState({ col, row })

  const styles = {
    content: { position: "absolute" },
    background: {
      height: Math.round(HEIGHT_PIX)
    }
  }

  const dragHandler = (e, data) => {
    const newCol = pos.col + data.x / HP_PIX
    const newRow = pos.row + data.y / HEIGHT_PIX
    dispatchAndPersist(moveModule(moduleId, newCol, newRow))
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

const mapDispatchToProps = { dispatchAndPersist }

export default connect(
  null,
  mapDispatchToProps
)(Plate)
