import * as R from "ramda"
import { connect } from "react-redux"
import { getDbKey } from "../../utils/firebase"
import { createCable, dragConnector, moveConnector } from "../../store/actions"
import { HP_PIX, HEIGHT_PIX } from "../../constants"
import Socket from "../../components/Socket"

const mapStateToProps = (state, { moduleId }) => {
  const { row, col } = R.pathOr({}, ["modules", moduleId], state)
  return {
    moduleX: col * HP_PIX,
    moduleY: row * HEIGHT_PIX,
    nextKey: getDbKey("cables")
  }
}

const mapDispatchToProps = {
  createCable,
  dragConnector,
  moveConnector
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Socket)
