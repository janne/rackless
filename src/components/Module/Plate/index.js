import React, { useState } from "react"
import * as R from "ramda"
import { connect } from "react-redux"
import { DraggableCore } from "react-draggable"
import {
  dispatchAndPersist,
  moveModule,
  setValue
} from "../../../store/actions"
import { HEIGHT_PIX, HP_PIX } from "../../../constants"

const Plate = ({
  moduleId,
  moduleX,
  moduleY,
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

  const [drag, setDrag] = useState(null)

  const dragStart = (e, data) => {
    setDrag({ x: data.x - moduleX, y: data.y - moduleY })
  }

  const dragEnd = () => setDrag(null)

  const dragHandler = (e, data) => {
    const newCol = Math.round((data.x - R.propOr(0, "x", drag)) / HP_PIX)
    const newRow = Math.round((data.y - R.propOr(0, "y", drag)) / HEIGHT_PIX)
    dispatchAndPersist(moveModule(moduleId, newCol, newRow))
  }

  return (
    <DraggableCore
      grid={[HP_PIX, HEIGHT_PIX]}
      onStart={dragStart}
      onDrag={dragHandler}
      onEnd={dragEnd}
      cancel=".draggable"
    >
      <div
        style={{
          ...styles.content,
          left: moduleX,
          top: moduleY
        }}
      >
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
    </DraggableCore>
  )
}

const mapStateToProps = (state, { moduleId }) => {
  const { row, col } = R.pathOr({}, ["modules", moduleId], state)
  return {
    moduleX: Math.round(col * HP_PIX),
    moduleY: Math.round(row * HEIGHT_PIX)
  }
}
const mapDispatchToProps = { dispatchAndPersist, setValue }

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Plate)
