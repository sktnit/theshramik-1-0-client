import React from 'react'
import makeStyles from '@mui/styles/makeStyles'
import Box from '@mui/material/Box'
import CssBaseline from '@mui/material/CssBaseline'
import Container from '@mui/material/Container'
import UserProfileDrawer from './UserProfileDrawer'

const drawerWidth = 280
const useStyles = makeStyles(() => ({
  landingPageRoot: {
    display: 'flex',
    minHeight: '100%'
  }
}))
function LandingPage(props) {
  const [open, setOpen] = React.useState(true)

  const handleDrawer = () => {
    setOpen(!open)
  }

  const classes = useStyles()
  return (
    <Box className={classes.landingPageRoot}>
      <CssBaseline />
      <UserProfileDrawer open={open} handleDrawer={handleDrawer} drawerWidth={drawerWidth} hideDrawer={props.hideDrawer} />
      <Box
        component="main"
        sx={{ padding: '116px 16px', flexGrow: 1, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Box sx={{ margin: 0, padding: 0, boxSizing: 0 }}>
          <Container maxWidth='lg'>
            {props.children}
          </Container>
        </Box>
      </Box>
    </Box>
  )
}

export default LandingPage