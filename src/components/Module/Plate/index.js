import React, { useRef } from "react"
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

  const drag = useRef()

  const dragStart = (e, data) => {
    drag.current = { x: data.x - moduleX, y: data.y - moduleY }
  }

  const dragHandler = (e, data) => {
    const { x, y } = drag.current
    const newCol = Math.round((data.x - x) / HP_PIX)
    const newRow = Math.round((data.y - y) / HEIGHT_PIX)
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
