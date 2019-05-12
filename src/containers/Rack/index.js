import React, { Fragment, useRef, useEffect } from "react"
import Tone from "tone"
import { connect } from "react-redux"
import * as R from "ramda"
import Cable from "../Cable"
import Module from "../Module"
import { getModules, getCables, getInstruments } from "../../store/selectors"
import {
  fetchView,
  fetchData,
  setLoggedIn,
  setLoading
} from "../../store/actions"
import { setLoginHandler } from "../../utils/firebase"

const Rack = ({
  modules,
  cables,
  instruments,
  fetchView,
  match,
  fetchData,
  setLoggedIn,
  setLoading
}) => {
  const performAnimation = useRef()
  const performLoop = useRef()

  useEffect(() => {
    setLoginHandler(user => {
      if (user) {
        fetchData(user.uid)
      }
      setLoading(false)
      setLoggedIn(Boolean(user && !user.isAnonymous))
    })
  }, [fetchData, setLoading, setLoggedIn])

  useEffect(() => {
    const params = R.prop("params", match)
    if (!R.isEmpty(params)) {
      const { uid, patchId } = params
      fetchView(uid, patchId)
    }
  }, [fetchView, match])

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
    Tone.context.lookAhead = 0
    setInterval(() => performLoop.current(), 10)
    requestAnimationFrame(performAnimation.current)
  }, [])

  const renderCable = id => <Cable key={id} id={id} />
  const renderModule = id => <Module key={id} id={id} />

  return (
    <Fragment>
      {R.map(renderModule, R.keys(modules))}
      {R.map(renderCable, R.keys(cables))}
    </Fragment>
  )
}

const mapStateToProps = state => ({
  modules: getModules(state),
  cables: getCables(state),
  instruments: getInstruments(state)
})

const mapDispatchToProps = { fetchView, fetchData, setLoggedIn, setLoading }

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Rack)
