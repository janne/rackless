import React, { useRef } from "react"
import { DraggableCore } from "react-draggable"
import { HEIGHT_PIX, HP_PIX } from "../../constants"

const Plate = ({
  moduleId,
  col,
  row,
  moduleX,
  moduleY,
  deleting,
  background,
  children,
  setModuleValue,
  moveModule,
  deleteModule,
  toggleDelete
}) => {
  const styles = {
    content: { position: "absolute" },
    background: {
      height: Math.round(HEIGHT_PIX),
      opacity: deleting ? 0.5 : 1
    }
  }

  const drag = useRef()

  const dragStart = (_, data) => {
    drag.current = { x: data.x - moduleX, y: data.y - moduleY }
  }

  const dragHandler = (_, data) => {
    const { x, y } = drag.current
    const newCol = Math.round((data.x - x) / HP_PIX)
    const newRow = Math.round((data.y - y) / HEIGHT_PIX)
    if (newCol !== col || newRow !== row) moveModule(moduleId, newCol, newRow)
  }

  return (
    <DraggableCore
      grid={[HP_PIX, HEIGHT_PIX]}
      onStart={dragStart}
      onDrag={dragHandler}
      cancel=".draggable"
    >
      <div
        onClick={() => {
          if (deleting) {
            toggleDelete()
            deleteModule(moduleId)
          }
        }}
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

export default Plate
