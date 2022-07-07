import React from 'react'
import MuiAppBar from '@mui/material/AppBar'
import IconButton from '@mui/material/IconButton'
import useTheme from '@mui/material/styles/useTheme'
import styled from '@mui/material/styles/styled'
import Avatar from '@mui/material/Avatar'
import Badge from '@mui/material/Badge'
import Box from '@mui/material/Box'
// import Container from '@mui/material/Container'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import CustomToolbar from '../UserProfile/CustomToolbar'
import NotificationsIcon from '@mui/icons-material/Notifications'
import useMediaQuery from '@mui/material/useMediaQuery/useMediaQuery'
import Logo from '../../media/logo.png'

import PropTypes from 'prop-types'
import { logout } from '../../firebase'
import Button from "@mui/material/Button";
import Theme from '../../theme'
import MenuIcon from "@mui/icons-material/Menu"
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
  const { open, drawerWidth, isAuthorized } = props
  const theme = useTheme()
  const settings = ['Profile', 'Account', 'Dashboard', 'Logout']
  const pages = [{
    title: 'Login',
    routeLink: '/login'
  }, {
    title: 'Register',
    routeLink: '/register'
  }];

  const [anchorElNav, setAnchorElNav] = React.useState(null)
  const [anchorElUser, setAnchorElUser] = React.useState(null)
  const navigate = useNavigate()
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget)
  }
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget)
  }

  const handleCloseNavMenu = (routeLink) => {
    if (routeLink) {
      navigate(routeLink)
    }
    setAnchorElNav(null)
  }

  const handleCloseUserMenu = () => {
    setAnchorElUser(null)
  }
  const lg = useMediaQuery((theme) => theme.breakpoints.up('lg'))
  const sm = useMediaQuery((theme) => theme.breakpoints.down('sm'))
  return (
    <AppBar
      position="fixed"
      open={open}
      drawerWidth={drawerWidth}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1
      }}
    >
      <CustomToolbar disableGutters={true}
        style={{
          padding: sm ? theme.spacing(0, 2) : theme.spacing(0, 5),
          height: lg ? '92px' : '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
        }}>
        <Box sx={{ display: "flex", mr: 1 }}>
          <img src={Logo} alt="theshramik.com" width={32} height={32} />
        </Box>
        <Typography
          variant="h6"
          noWrap
          component="a"
          href="/"
          sx={{
            mr: 2,
            display: "flex",
            fontFamily: "Open Sans",
            fontWeight: 700,
            fontSize: '1.5rem',
            color: "inherit",
            textDecoration: "none"
          }}
        >
          The Shramik
        </Typography>

        <Box sx={{ flexGrow: 1, display: "flex" }}>
        </Box>

        <Box>
          {isAuthorized ?
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <Box sx={{ marginLeft: 12, display: { xs: 'none', md: 'flex' } }}>
                <IconButton
                  size="large"
                  aria-label="show 17 new notifications"
                  color="inherit"
                  sx={{ padding: '8px' }}
                >
                  <Badge badgeContent={17} color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
              </Box>
              <div style={{ marginLeft: 12 }}>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ padding: '8px' }}>
                    <Avatar alt="Remy Sharp" src="https://ui-avatars.com/api/?rounded=true" />
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
                <MenuItem key={'notification'} onClick={handleCloseUserMenu} sx={{ display: { xs: 'flex', md: 'none' } }}>
                  <Typography textAlign="center">Notification</Typography>
                </MenuItem>
                {settings.map((setting) => (
                  <MenuItem key={setting} onClick={() => setting === 'Logout' ? logout() : handleCloseUserMenu()}>
                    <Typography textAlign="center">{setting}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
            : <>
              <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                <Tooltip title="Login">
                  <Button color="inherit" href="/login">Login</Button>
                </Tooltip>
                <Tooltip title="Create Your Account">
                  <Button color="inherit" href="/register">Register</Button>
                </Tooltip>
              </Box>
              <Box sx={{ display: { xs: "flex", md: "none" } }}>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleOpenNavMenu}
                  color="inherit"
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorElNav}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left"
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "left"
                  }}
                  open={Boolean(anchorElNav)}
                  onClose={handleCloseNavMenu}
                  sx={{
                    display: { xs: "block", md: "none" }
                  }}
                >
                  {pages.map((page) => (
                    <MenuItem key={page.title} onClick={() => handleCloseNavMenu(page.routeLink)}>
                      <Typography textAlign="center">{page.title}</Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
            </>
          }
        </Box>

      </CustomToolbar>
    </AppBar >
  )
}

CustomAppBar.propTypes = {}

export default CustomAppBar
