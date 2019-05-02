import React from "react"
import * as R from "ramda"
import { connect } from "react-redux"
import { setValue, setInstrument } from "../../store/actions"
import Module from "../../components/Module"

const ModuleContainer = ({ id, data, instrument, setInstrument, setValue }) => {
  return (
    <Module
      id={id}
      data={data}
      instrument={instrument}
      setInstrument={setInstrument}
      setValue={setValue}
    />
  )
}

const mapStateToProps = (state, { id }) => ({
  data: R.path(["modules", id], state),
  instrument: R.path(["instruments", id], state)
})

const mapDispatchToProps = {
  setInstrument,
  setValue
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ModuleContainer)
