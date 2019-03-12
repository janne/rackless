import React from "react"
import { connect } from "react-redux"
import * as R from "ramda"
import { changeTrimpot } from "../../store/actions"
import background from "./background.svg"

const styles = {
  content: { position: "absolute" }
}

const Trimpot = ({ x, y, width = 30, mod, pot, value = 0, changeTrimpot }) => {
  const clickHandler = () => {
    changeTrimpot(mod, pot, value + 1)
  }

  return (
    <div style={{ ...styles.content, left: x, top: y }} onClick={clickHandler}>
      <img src={background} style={{ width }} alt="Trimpot" />
    </div>
  )
}

const mapStateToProps = (state, ownProps) => ({
  value: R.path([ownProps.mod, ownProps.pot, "value"], state)
})

const mapDispatchToProps = { changeTrimpot }

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Trimpot)
