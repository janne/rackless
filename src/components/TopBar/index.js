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
  Divider,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  colors
} from "@material-ui/core"
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles"
import logo from "./logo.svg"

const styles = {
  menuTitle: {
    display: "flex",
    flexGrow: 1
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  }
}

const TopBar = ({ items, deleteHandler, deleting }) => {
  const [leftMenu, setLeftMenu] = useState(false)
  const [rightMenu, setRightMenu] = useState(false)

  const theme = createMuiTheme({
    palette: {
      primary: colors.grey,
      secondary: colors.deepOrange
    },
    typography: {
      useNextVariants: true
    }
  })

  const renderListItem = ({ title, handler }) => (
    <ListItem button key={title} onClick={handler}>
      <ListItemText>{title}</ListItemText>
    </ListItem>
  )

  const renderPatchItem = ({ title, handler }, idx) => {
    const selected = idx === 0
    return (
      <ListItem button key={title} onClick={handler} selected={selected}>
        <ListItemText>{title}</ListItemText>
        {!selected && (
          <ListItemSecondaryAction>
            <IconButton>
              <DeleteIcon />
            </IconButton>
          </ListItemSecondaryAction>
        )}
      </ListItem>
    )
  }

  return (
    <MuiThemeProvider theme={theme}>
      <AppBar position="static">
        <Toolbar variant="dense">
          <IconButton
            style={styles.menuButton}
            onClick={() => setLeftMenu(true)}
          >
            <MenuIcon />
          </IconButton>
          <div style={styles.menuTitle}>
            <img src={logo} alt="Rackless" />
          </div>
          <IconButton onClick={deleteHandler}>
            <DeleteIcon color={deleting ? "secondary" : "inherit"} />
          </IconButton>
          <IconButton onClick={e => setRightMenu(e.currentTarget)}>
            <AddIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer open={leftMenu} onClick={() => setLeftMenu(false)}>
        <List>{R.map(renderListItem, items.menu)}</List>
        {R.isEmpty(items.patches) ? null : <Divider />}
        <List>{R.addIndex(R.map)(renderPatchItem, items.patches)}</List>
      </Drawer>

      <Drawer
        anchor="right"
        open={rightMenu}
        onClick={() => setRightMenu(false)}
      >
        <List>{R.map(renderListItem, items.add)}</List>
      </Drawer>
    </MuiThemeProvider>
  )
}

export default TopBar
