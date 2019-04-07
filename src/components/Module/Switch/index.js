import React from "react"
import * as R from "ramda"
import background from "./background.svg"

const Switch = ({ x, y, id, name, range = [], value, setValue }) => {
  const styles = {
    content: {
      position: "absolute",
      cursor: "pointer",
      width: 32,
      left: x,
      top: y
    }
  }

  const clickHandler = () => {
    const currentValue = value || range[0]
    const index = R.findIndex(R.equals(currentValue), range)
    if (index >= 0) {
      const newIndex = (index + 1) % range.length
      console.log(range[newIndex])
      setValue(id, name, range[newIndex])
    }
  }

  return (
    <div style={styles.content} onClick={clickHandler}>
      <img draggable={false} src={background} alt="Trimpot" />
    </div>
  )
}

export default Switch
