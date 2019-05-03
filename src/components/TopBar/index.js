import React, { useState } from "react"
import * as R from "ramda"
import {
  Menu as MenuIcon,
  AddCircle as AddIcon,
  Delete as DeleteIcon
} from "@material-ui/icons"
import {
  IconButton,
  Toolbar,
  AppBar,
  Drawer,
  List,
  ListItem,
  ListItemText,
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
  const [topMenu, setTopMenu] = useState(false)
  const [addMenu, setAddMenu] = useState(false)

  const theme = createMuiTheme({
    palette: {
      primary: colors.grey,
      secondary: colors.deepOrange
    },
    typography: {
      useNextVariants: true
    }
  })

  const renderListItem = ({ title, handler }) => {
    return (
      <ListItem button key={title} onClick={handler}>
        <ListItemText>{title}</ListItemText>
      </ListItem>
    )
  }

  return (
    <MuiThemeProvider theme={theme}>
      <AppBar position="static">
        <Toolbar variant="dense">
          <IconButton
            style={styles.menuButton}
            onClick={() => setTopMenu(true)}
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

      <Drawer open={topMenu} onClick={() => setTopMenu(false)}>
        <List>{R.map(renderListItem, items.menu)}</List>
      </Drawer>

      <Drawer anchor="right" open={addMenu} onClick={() => setAddMenu(false)}>
        <List>{R.map(renderListItem, items.add)}</List>
      </Drawer>
    </MuiThemeProvider>
  )
}

export default TopBar
