import React, { Fragment, useRef, useEffect } from "react"
import { connect } from "react-redux"
import * as R from "ramda"
import Cable from "../Cable"
import Module from "../Module"

const Rack = ({ modules, cables, instruments }) => {
  const performAnimation = useRef()
  const performLoop = useRef()

  useEffect(() => {
    performAnimation.current = () => {
      requestAnimationFrame(performAnimation.current)
      R.forEachObjIndexed((instrument, id) => {
        if (instrument.animate) instrument.animate(id)
      }, instruments)
    }

    performLoop.current = () => {
      const instrumentsWithLoop = R.filter(
        i => Boolean(R.prop("loop", i)),
        instruments
      )
      R.forEachObjIndexed((instrument, id) => {
        instrument.props = instrument.loop(
          instrument.props || {},
          modules[id].values || {}
        )
      }, instrumentsWithLoop)
    }
  }, [instruments, modules])

  useEffect(() => {
    setInterval(() => performLoop.current(), 10)
    requestAnimationFrame(performAnimation.current)
  }, [])
  return (
    <Fragment>
      {R.map(
        id => (
          <Module key={id} id={id} />
        ),
        R.keys(modules)
      )}
      {R.values(
        R.mapObjIndexed(
          (props, id) => <Cable key={id} id={id} {...props} />,
          cables
        )
      )}
    </Fragment>
  )
}

const mapStateToProps = state => ({
  cables: R.propOr([], "cables", state),
  modules: R.propOr([], "modules", state),
  instruments: R.propOr([], "instruments", state)
})

export default connect(mapStateToProps)(Rack)
