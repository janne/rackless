import React from "react"
import * as R from "ramda"
import background from "./background.svg"

const Switch = ({ x, y, id, name, range = [], value, setValue }) => {
  const styles = {
    content: {
      cursor: "pointer",
      width: 32
    }
  }

  const currentValue = value || range[0]

  const clickHandler = () => {
    const index = R.findIndex(R.equals(currentValue), range)
    if (index >= 0) {
      const newIndex = (index + 1) % range.length
      setValue(id, name, range[newIndex])
    }
  }

  return (
    <div style={styles.content} onClick={clickHandler}>
      <img
        draggable={false}
        src={background}
        style={{
          ...styles.img,
          transform: `rotate(${currentValue === range[0] ? 0 : 180}deg)`
        }}
        alt="Switch"
      />
    </div>
  )
}

export default Switch
