import React from "react"
import { ZOOM, CABLE_SLACK } from "../../../constants"

const Cable = ({ x1, y1, x2, y2, color }) => {
  const hang = Math.cbrt(Math.abs(x2 - x1)) * CABLE_SLACK
  const strokeWidth = 3 * ZOOM
  const left = Math.min(x1, x2) - strokeWidth
  const top = Math.min(y1, y2) - strokeWidth
  const width = Math.abs(x2 - x1) + 2 * strokeWidth
  const height = Math.abs(y2 - y1) + 2 * strokeWidth + hang
  return (
    <div
      style={{
        position: "absolute",
        pointerEvents: "none",
        left,
        top
      }}
    >
      <svg width={width} height={height} xmlns="http://www.w3.org/2000/svg">
        <path
          d={`M${x1 - left} ${y1 - top} C ${x1 - left} ${y1 -
            top +
            hang}, ${x2 - left} ${y2 - top + hang}, ${x2 - left} ${y2 - top}`}
          stroke={color}
          strokeWidth={strokeWidth}
          opacity={0.8}
          strokeLinecap="round"
          fill="transparent"
        />
      </svg>
    </div>
  )
}

export default Cable
