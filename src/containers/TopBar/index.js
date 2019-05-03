import React, { useEffect } from "react"
import * as R from "ramda"
import { connect } from "react-redux"
import TopBar from "../../components/TopBar"
import * as moduleTypes from "../../modules"
import { getLoggedIn, isDeleting } from "../../store/selectors"
import { createModule, toggleDelete, signOut } from "../../store/actions"
import { getCurrentUser, signIn } from "../../utils/firebase"

const TopBarContainer = ({
  deleting,
  toggleDelete,
  isLoggedIn,
  signOut,
  createModule
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

  const navItems = () => ({
    menu: [
      {
        title: "Open Reddit",
        handler: () => window.open("https://www.reddit.com/r/rackless")
      },
      {
        title: isLoggedIn
          ? `Log out ${R.propOr("", "displayName", getCurrentUser())}`
          : "Log in",
        handler: isLoggedIn ? signOut : signIn
      }
    ],
    add: R.map(
      type => ({
        title: titleize(type),
        handler: () => createModule(type)
      }),
      R.sortBy(R.identity, R.keys(moduleTypes))
    )
  })

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
  deleting: isDeleting(state)
})

const mapDispatchToProps = {
  createModule,
  toggleDelete,
  signOut
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TopBarContainer)
