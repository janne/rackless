import React, { useState } from "react"
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
  Typography,
  Toolbar,
  AppBar,
  colors
} from "@material-ui/core"
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles"

const styles = {
  menuTitle: {
    flexGrow: 1
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  }
}

const TopBar = ({ items, deleteHandler, deleting }) => {
  const theme = createMuiTheme({
    palette: {
      primary: colors.grey,
      type: "light"
    },
    typography: {
      useNextVariants: true
    }
  })

  const [topMenu, setTopMenu] = useState(null)
  const [addMenu, setAddMenu] = useState(null)

  const renderMenuItem = close => ({ title, handler }) => {
    const handleAndClose = () => {
      close()
      handler()
    }
    return <MenuItem onClick={handleAndClose}>{title}</MenuItem>
  }

  const closeTopMenu = () => setTopMenu(null)
  const closeAddMenu = () => setAddMenu(null)

  return (
    <MuiThemeProvider theme={theme}>
      <AppBar position="static">
        <Toolbar variant="dense">
          <IconButton
            id="topMenuButton"
            style={styles.menuButton}
            onClick={e => setTopMenu(e.currentTarget)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" style={styles.menuTitle}>
            Rackless
          </Typography>
          <IconButton>
            <DeleteIcon color={deleting ? "secondary" : "inherit"} />
          </IconButton>

          <IconButton
            id="addMenuButton"
            onClick={e => setAddMenu(e.currentTarget)}
          >
            <AddIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Menu anchorEl={topMenu} open={Boolean(topMenu)} onClose={closeTopMenu}>
        {R.map(renderMenuItem(closeTopMenu), items.menu)}
      </Menu>

      <Menu anchorEl={addMenu} open={Boolean(addMenu)} onClose={closeAddMenu}>
        {R.map(renderMenuItem(closeAddMenu), items.add)}
      </Menu>
    </MuiThemeProvider>
  )
}

export default TopBar
