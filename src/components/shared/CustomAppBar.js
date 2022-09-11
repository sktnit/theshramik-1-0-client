import React from 'react'
import MuiAppBar from '@mui/material/AppBar'
import IconButton from '@mui/material/IconButton'
import { styled, useTheme } from '@mui/material/styles'
import Avatar from '@mui/material/Avatar'
import Badge from '@mui/material/Badge'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import CustomToolbar from './CustomToolbar'
import NotificationsIcon from '@mui/icons-material/Notifications'
import useMediaQuery from '@mui/material/useMediaQuery/useMediaQuery'

import PropTypes from 'prop-types'
import { logout } from '../../firebase'
import { useUserData } from '../../AuthContext'
import { useNavigate } from 'react-router-dom'

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open' && prop !== 'drawerWidth',
})(({ theme, open, drawerWidth }) => ({
  ...(!open && {
    width: `calc(100% - (${theme.spacing(7)} + 1px))`,
    [theme.breakpoints.up('lg')]: {
      width: `calc(100% - (${theme.spacing(8)} + 1px))`,
    },
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth + 1}px)!important`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
  backdropFilter: 'blur(6px)',
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  // color: '#FFFFFF',
  boxSizing: 'border-box',
  boxShadow: 'none',
}))

function CustomAppBar(props) {
  const { open, drawerWidth } = props
  const theme = useTheme()
  const [anchorElNav, setAnchorElNav] = React.useState(null)
  const [anchorElUser, setAnchorElUser] = React.useState(null)

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget)
  }
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget)
  }

  const handleCloseNavMenu = () => {
    setAnchorElNav(null)
  }

  const routeMap = {
    'Home': '/home',
    'Login': '/login',
    'Profile': '/user-profile',
    'Dashboard': '/admin-dashboard'
  };
  const navigate = useNavigate()
  const handleCloseUserMenu = (value) => {
    navigate(routeMap[value])
    setAnchorElUser(null)

  }
  const lg = useMediaQuery((theme) => theme.breakpoints.up('lg'))
  const { userData } = useUserData()
  const settings = userData.role === '0' ? ['Profile', 'Logout'] : userData.role  === '1' ? ['Home', 'Profile', 'Logout'] : ['Home', 'Dashboard', 'Profile', 'Logout']

  return (
    <AppBar
      position="fixed"
      open={open}
      drawerWidth={drawerWidth}
    >
      <CustomToolbar disableGutters={true}
        style={{
          padding: theme.spacing(0, 5),
          height: lg ? '92px' : '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
        }}>
        <Box sx={{ flexGrow: 1 }} />
        <Box sx={{ display: { xs: 'none', md: 'flex' }, flexDirection: 'row', alignItems: 'center' }}>
          <div style={{ marginLeft: 12 }}>
            {/* <IconButton
              size="large"
              aria-label="show 17 new notifications"
              color="inherit"
              sx={{ padding: '8px' }}
            >
              <Badge badgeContent={17} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton> */}
          </div>
          <div style={{ marginLeft: 12 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ padding: '8px' }}>
                <Avatar alt={userData.name || ''} src={userData.profilePic || ''} />
              </IconButton>
            </Tooltip>
          </div>
          <Menu
            sx={{ mt: "45px" }}
            id="menu-appbar"
            anchorEl={anchorElUser}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right"
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right"
            }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
          >
            {settings.map((setting) => (
              <MenuItem key={setting} onClick={() => setting === 'Logout' ? logout() : handleCloseUserMenu(setting)}>
                <Typography textAlign="center">{setting}</Typography>
              </MenuItem>
            ))}
          </Menu>
        </Box>
      </CustomToolbar>
    </AppBar>
  )
}

CustomAppBar.propTypes = {}

export default CustomAppBar
