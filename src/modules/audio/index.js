import React from "react"
import img from "./AudioInterface.svg"
import "../modules.css"

export default ({ left }) => (
  <img src={img} alt="AudioInterface" className="module" style={{ left }} />
)
