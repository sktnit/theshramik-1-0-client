import React from 'react'
// import PropTypes from 'prop-types'
// import makeStyles from '@mui/styles/makeStyles'
import { styled, useTheme } from '@mui/material/styles'
import MuiDrawer from '@mui/material/Drawer'
// import List from '@mui/material/List'
// import MenuIcon from '@mui/icons-material/Menu'
// import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
// import ChevronRightIcon from '@mui/icons-material/ChevronRight'
// import ListItem from '@mui/material/ListItem'
// import ListItemButton from '@mui/material/ListItemButton'
// import ListItemIcon from '@mui/material/ListItemIcon'
// import ListItemText from '@mui/material/ListItemText'
// import InboxIcon from '@mui/icons-material/MoveToInbox'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import CustomToolbar from './CustomToolbar'
import CustomAppBar from './CustomAppBar'
import useMediaQuery from '@mui/material/useMediaQuery/useMediaQuery'

const openedMixin = (theme, drawerWidth) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  // overflowX: 'hidden',
  // color: 'rgb(33, 43, 54)',
  // boxShadow: 'none',
  // backgroundImage: 'none',
  // overflowY: 'auto',
  // display: 'flex',
  // flexDirection: 'column',
  // height: '100%',
  // flex: '1 0 auto',
  // zIndex: '1200',
  // position: 'fixed',
  // top: '0px',
  // outline: '0px',
  // left: '0px',
  borderRight: '1px dashed rgba(145, 158, 171, 0.24)',
  // width: '280px',
  // backgroundColor: 'rgba(255, 255, 255, 0.8)',
  // backdropFilter: 'blur(6px)',
  transition: 'width 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
})

const closedMixin = (theme, drawerWidth) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  height: '100%',
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
  // overflowX: 'hidden',
  // color: 'rgb(33, 43, 54)',
  // boxShadow: 'none',
  // backgroundImage: 'none',
  // overflowY: 'auto',
  // display: 'flex',
  // flexDirection: 'column',
  // height: '100%',
  // flex: '1 0 auto',
  // zIndex: '1200',
  // position: 'fixed',
  // top: '0px',
  // outline: '0px',
  // left: '0px',
  borderRight: '1px dashed rgba(145, 158, 171, 0.24)',
  // width: '88px',
  // backgroundColor: 'rgba(255, 255, 255, 0.8)',
  // backdropFilter: 'blur(6px)',
  // transition: 'width 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
})

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' && prop !== 'drawerWidth' })(
  ({ theme, open, drawerWidth }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme, drawerWidth),
      '& .MuiDrawer-paper': openedMixin(theme, drawerWidth),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme, drawerWidth),
    }),
  }),
)

export const UserProfileDrawer = (props) => {
  const { open, handleDrawer, drawerWidth, hideDrawer } = props
  const theme = useTheme()
  const lg = useMediaQuery((theme) => theme.breakpoints.up('lg'))

  return (
    <>
      <CustomAppBar open={open} drawerWidth={drawerWidth} />
      {!hideDrawer && <Drawer variant="permanent" open={open} drawerWidth={drawerWidth}>
        <CustomToolbar
          style={{
            padding: open ? theme.spacing(3, 2.5, 2) : theme.spacing(2),
            height: 'fit-content',
            minHeight: 'fit-content',
            display: 'flex',
            flexDirection: 'column',
            // alignItems: 'center',
            justifyContent: 'flex-end',
          }}
        >
          <Box sx={{ display: 'flex' }}>
            {/* <IconButton onClick={handleDrawer}>
              {!open ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton> */}
          </Box>
          <Typography>
            {/* <Box>
              
            </Box> */}
          </Typography>
        </CustomToolbar>
      </Drawer>
      }
    </>
  )
}

UserProfileDrawer.propTypes = {
  // second: PropTypes.third
}

export default UserProfileDrawer