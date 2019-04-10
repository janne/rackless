import React from "react"
import { connect } from "react-redux"
import Draggable from "react-draggable"
import {
  dispatchAndPersist,
  moveModule,
  setValue
} from "../../../store/actions"
import { HEIGHT_PIX, HP_PIX } from "../../../constants"

const Plate = ({
  moduleId,
  col,
  row,
  background,
  children,
  setValue,
  dispatchAndPersist
}) => {
  const styles = {
    content: { position: "absolute" },
    background: {
      height: Math.round(HEIGHT_PIX)
    }
  }

  const dragHandler = (e, data) => {
    const newCol = data.x / HP_PIX
    const newRow = data.y / HEIGHT_PIX
    dispatchAndPersist(moveModule(moduleId, newCol, newRow))
  }

  return (
    <Draggable
      grid={[HP_PIX, HEIGHT_PIX]}
      onDrag={dragHandler}
      position={{ x: col * HP_PIX, y: row * HEIGHT_PIX }}
      cancel=".draggable"
    >
      <div onDrag={dragHandler} style={styles.content}>
        <img
          draggable={false}
          src={background}
          style={styles.background}
          onLoad={e =>
            setValue(moduleId, "hp", Math.round(e.target.width / HP_PIX))
          }
          alt=""
        />
        {children}
      </div>
    </Draggable>
  )
}

const mapDispatchToProps = { dispatchAndPersist, setValue }

export default connect(
  null,
  mapDispatchToProps
)(Plate)
