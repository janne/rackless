import React from "react"
import {
  HEIGHT_PIX,
  HP_PIX,
  ZOOM,
  MAX_COLS,
  MAX_ROWS,
  CABLE_SLACK
} from "../../../constants"

const Cable = ({ x1, y1, x2, y2, color }) => {
  const hang = Math.cbrt(Math.abs(x2 - x1)) * CABLE_SLACK
  return (
    <div style={{ position: "absolute", pointerEvents: "none" }}>
      <svg
        width={MAX_COLS * HP_PIX}
        height={MAX_ROWS * HEIGHT_PIX}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d={`M${x1} ${y1} C ${x1} ${y1 + hang}, ${x2} ${y2 +
            hang}, ${x2} ${y2}`}
          stroke={color}
          strokeWidth={3 * ZOOM}
          opacity={0.8}
          strokeLinecap="round"
          fill="transparent"
        />
      </svg>
    </div>
  )
}

export default Cable
