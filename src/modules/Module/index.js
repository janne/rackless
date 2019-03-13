import React from "react"
import { connect } from "react-redux"
import * as R from "ramda"
import { moveModule } from "../../store/actions"

const styles = {
  content: { position: "absolute" },
  background: { height: 400 }
}

const Module = ({ id, x, y, background, children, moveModule }) => {
  return (
    <div style={{ ...styles.content, left: x, top: y }}>
      <img src={background} style={styles.background} alt="" />
      {children}
    </div>
  )
}

const mapStateToProps = (state, ownProps) => {
  return {
    x: R.pathOr(0, [ownProps.id, "x"], state),
    y: R.pathOr(0, [ownProps.id, "y"], state)
  }
}

const mapDispatchToProps = { moveModule }

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Module)
