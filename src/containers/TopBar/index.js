import React, { useEffect } from "react"
import * as R from "ramda"
import { connect } from "react-redux"
import * as firebase from "../../utils/firebase"
import TopBar from "../../components/TopBar"
import * as moduleTypes from "../../modules"
import {
  getLoggedIn,
  isDeleting,
  getPatches,
  getCurrent
} from "../../store/selectors"
import {
  createModule,
  createPatch,
  sharePatch,
  toggleDelete,
  deletePatch,
  signOut,
  setCurrent
} from "../../store/actions"
import { getCurrentUser, signIn } from "../../utils/firebase"
import { withRouter } from "react-router-dom"

const TopBarContainer = ({
  deleting,
  toggleDelete,
  isLoggedIn,
  signOut,
  createModule,
  createPatch,
  sharePatch,
  deletePatch,
  setCurrent,
  patches = {},
  current,
  history
}) => {
  const titleize = text => text.replace(/([A-Z])/g, " $1")

  const isRoot = R.pathOr("/", ["location", "pathname"], history) === "/"

  const handleKeyPress = e => {
    switch (e.key) {
      case "Backspace":
        toggleDelete()
        break
      default:
    }
  }

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress, false)
    return () => {
      document.removeEventListener("keydown", handleKeyPress, false)
    }
  })

  const formatTime = time =>
    new Date(time).toLocaleString([], {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    })

  const createHandler = handler => () => {
    if (!isRoot) history.replace("/")
    handler()
  }

  const shareHandler = () => {
    const uid = firebase.getCurrentUser().uid
    sharePatch(uid, current)
  }

  const navItems = () => {
    const loggedInActions = isLoggedIn
      ? [{ title: "New Patch", handler: createHandler(createPatch) }]
      : []
    return {
      menu: [
        ...loggedInActions,
        {
          title: "Open Reddit",
          handler: createHandler(() =>
            window.open("https://www.reddit.com/r/rackless")
          )
        },
        {
          title: isLoggedIn
            ? `Log out ${R.propOr("", "displayName", getCurrentUser())}`
            : "Log in",
          handler: isLoggedIn ? signOut : signIn
        }
      ],
      patches: R.map(
        id => ({
          id,
          selected: id === current,
          title: formatTime(patches[id].createdAt),
          handler: id === current ? null : createHandler(() => setCurrent(id)),
          secondaryHandler:
            id === current ? null : createHandler(() => deletePatch(id))
        }),
        R.keys(patches)
      ),
      add: isRoot
        ? R.map(
            type => ({
              title: titleize(type),
              handler: () => createModule(type)
            }),
            R.sortBy(R.identity, R.keys(moduleTypes))
          )
        : null
    }
  }

  return (
    <TopBar
      items={navItems()}
      deleteHandler={toggleDelete}
      shareHandler={shareHandler}
      deleting={deleting}
      readOnly={!isRoot}
    />
  )
}

const mapStateToProps = state => ({
  isLoggedIn: getLoggedIn(state),
  deleting: isDeleting(state),
  patches: getPatches(state),
  current: getCurrent(state)
})

const mapDispatchToProps = {
  createModule,
  toggleDelete,
  createPatch,
  sharePatch,
  deletePatch,
  setCurrent,
  signOut
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(TopBarContainer)
)
