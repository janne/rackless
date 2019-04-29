import React from "react"
import AppBar from "@material-ui/core/AppBar"
import Toolbar from "@material-ui/core/Toolbar"
import TypoGraphy from "@material-ui/core/Typography"
import IconButton from "@material-ui/core/IconButton"
import { Menu as MenuIcon, AddCircle } from "@material-ui/icons"
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles"
import { grey } from "@material-ui/core/colors"

const styles = {
  menuTitle: {
    flexGrow: 1
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  }
}

const theme = createMuiTheme({
  palette: {
    primary: grey,
    type: "light"
  }
})

const TopBar = () => (
  <MuiThemeProvider theme={theme}>
    <AppBar position="static">
      <Toolbar variant="dense">
        <IconButton style={styles.menuButton}>
          <MenuIcon />
        </IconButton>
        <TypoGraphy variant="h6" style={styles.menuTitle}>
          Rackless
        </TypoGraphy>
        <IconButton>
          <AddCircle />
        </IconButton>
      </Toolbar>
    </AppBar>
  </MuiThemeProvider>
)

export default TopBar
