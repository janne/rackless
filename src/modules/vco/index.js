import React from "react"
import img from "./VCO-1.svg"
import "../modules.css"

export default ({ left }) => (
  <img src={img} alt="VCO" className="module" style={{ left }} />
)
