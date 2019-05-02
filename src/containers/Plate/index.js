import * as R from "ramda"
import { connect } from "react-redux"
import { isDeleting } from "../../store/selectors"
import {
  moveModule,
  deleteModule,
  setModuleValue,
  toggleDelete
} from "../../store/actions"
import { HEIGHT_PIX, HP_PIX } from "../../constants"
import Plate from "../../components/Plate"

const mapStateToProps = (state, { moduleId }) => {
  const { row, col } = R.pathOr({}, ["modules", moduleId], state)
  return {
    moduleX: Math.round(col * HP_PIX),
    moduleY: Math.round(row * HEIGHT_PIX),
    deleting: isDeleting(state)
  }
}
const mapDispatchToProps = {
  moveModule,
  deleteModule,
  setModuleValue,
  toggleDelete
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Plate)
