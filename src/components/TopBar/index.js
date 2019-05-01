import React, { useState, useEffect } from "react"
import * as R from "ramda"
import {
  Menu as MenuIcon,
  AddCircle as AddIcon,
  Delete as DeleteIcon
} from "@material-ui/icons"
import {
  Menu,
  MenuItem,
  IconButton,
  Toolbar,
  AppBar,
  colors
} from "@material-ui/core"
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles"
import logo from "./logo.svg"

const styles = {
  menuTitle: {
    flexGrow: 1,
    width: "100%"
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  }
}

const TopBar = ({ items, deleteHandler, deleting }) => {
  const [topMenu, setTopMenu] = useState(null)
  const [addMenu, setAddMenu] = useState(null)

  const handleKeyPress = e => {
    switch (e.key) {
      case "Backspace":
        deleteHandler()
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

  const theme = createMuiTheme({
    palette: {
      primary: colors.grey,
      secondary: colors.deepOrange
    },
    typography: {
      useNextVariants: true
    }
  })

  const renderMenuItem = close => ({ title, handler }) => {
    const handleAndClose = () => {
      close()
      handler()
    }
    return (
      <MenuItem key={title} onClick={handleAndClose}>
        {title}
      </MenuItem>
    )
  }

  const closeTopMenu = () => setTopMenu(null)
  const closeAddMenu = () => setAddMenu(null)

  return (
    <MuiThemeProvider theme={theme}>
      <AppBar position="static">
        <Toolbar variant="dense">
          <IconButton
            style={styles.menuButton}
            onClick={e => setTopMenu(e.currentTarget)}
          >
            <MenuIcon />
          </IconButton>
          <span style={styles.menuTitle}>
            <img src={logo} alt="Rackless" />
          </span>
          <IconButton onClick={deleteHandler}>
            <DeleteIcon color={deleting ? "secondary" : "inherit"} />
          </IconButton>

          <IconButton onClick={e => setAddMenu(e.currentTarget)}>
            <AddIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Menu
        anchorEl={topMenu}
        open={Boolean(topMenu)}
        onClose={closeTopMenu}
        disableAutoFocusItem={true}
      >
        {R.map(renderMenuItem(closeTopMenu), items.menu)}
      </Menu>

      <Menu
        anchorEl={addMenu}
        open={Boolean(addMenu)}
        onClose={closeAddMenu}
        disableAutoFocusItem={true}
      >
        {R.map(renderMenuItem(closeAddMenu), items.add)}
      </Menu>
    </MuiThemeProvider>
  )
}

export default TopBar
