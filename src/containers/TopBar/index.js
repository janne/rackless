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
  current
}) => {
  const titleize = text => text.replace(/([A-Z])/g, " $1")

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

  const navItems = () => {
    const loggedInActions = isLoggedIn
      ? [
          { title: "New Patch", handler: createPatch },
          {
            title: "Share Patch",
            handler: () => {
              const uid = firebase.getCurrentUser().uid
              const pid = current.slice()
              sharePatch(uid, pid)
            }
          }
        ]
      : []
    return {
      menu: [
        {
          title: isLoggedIn
            ? `Log out ${R.propOr("", "displayName", getCurrentUser())}`
            : "Log in",
          handler: isLoggedIn ? signOut : signIn
        },
        {
          title: "Open Reddit",
          handler: () => window.open("https://www.reddit.com/r/rackless")
        },
        ...loggedInActions
      ],
      patches: R.map(
        id => ({
          id,
          selected: id === current,
          title: formatTime(patches[id].createdAt),
          handler: id === current ? null : () => setCurrent(id),
          secondaryHandler: id === current ? null : () => deletePatch(id)
        }),
        R.keys(patches)
      ),
      add: R.map(
        type => ({
          title: titleize(type),
          handler: () => createModule(type)
        }),
        R.sortBy(R.identity, R.keys(moduleTypes))
      )
    }
  }

  return (
    <TopBar
      items={navItems()}
      deleteHandler={toggleDelete}
      deleting={deleting}
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TopBarContainer)
