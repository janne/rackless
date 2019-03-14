import React from "react"

const Cable = ({ x1, y1, x2, y2, color }) => {
  return (
    <div style={{ position: "absolute", pointerEvents: "none" }}>
      <svg width="100vw" height="100vh" xmlns="http://www.w3.org/2000/svg">
        <path
          d={`M${x1} ${y1} C ${x1} ${y1 + 100}, ${x2} ${y2 + 100}, ${x2} ${y2}`}
          stroke={color}
          strokeWidth={8}
          opacity={0.8}
          strokeLinecap="round"
          fill="transparent"
        />
      </svg>
    </div>
  )
}

export default Cable
