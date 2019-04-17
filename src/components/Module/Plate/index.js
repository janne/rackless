import React, { useRef } from "react"
import * as R from "ramda"
import { connect } from "react-redux"
import { DraggableCore } from "react-draggable"
import {
  dispatchAndPersist,
  moveModule,
  setModuleValue
} from "../../../store/actions"
import { HEIGHT_PIX, HP_PIX } from "../../../constants"

const Plate = ({
  moduleId,
  col,
  row,
  moduleX,
  moduleY,
  background,
  children,
  setModuleValue,
  dispatchAndPersist
}) => {
  const styles = {
    content: { position: "absolute" },
    background: {
      height: Math.round(HEIGHT_PIX)
    }
  }

  const drag = useRef()

  const dragStart = (e, data) => {
    drag.current = { x: data.x - moduleX, y: data.y - moduleY }
  }

  const dragHandler = (e, data) => {
    const { x, y } = drag.current
    const newCol = Math.round((data.x - x) / HP_PIX)
    const newRow = Math.round((data.y - y) / HEIGHT_PIX)
    if ((newCol !== col || newRow !== row) && newCol >= 0 && newRow >= 0)
      dispatchAndPersist(moveModule(moduleId, newCol, newRow))
  }

  return (
    <DraggableCore
      grid={[HP_PIX, HEIGHT_PIX]}
      onStart={dragStart}
      onDrag={dragHandler}
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
            setModuleValue(moduleId, "hp", Math.round(e.target.width / HP_PIX))
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
const mapDispatchToProps = { dispatchAndPersist, setModuleValue }

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Plate)
