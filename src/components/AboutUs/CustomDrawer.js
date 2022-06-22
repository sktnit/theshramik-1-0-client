import * as React from 'react'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import AppBar from '@mui/material/AppBar'
import CssBaseline from '@mui/material/CssBaseline'
import Toolbar from '@mui/material/Toolbar'
import List from '@mui/material/List'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import { makeStyles } from '@mui/styles'
import { Icons } from '../shared/Icons'
import { Icon, Tooltip } from '@mui/material'
import FbIcon from '../../media/facebook.svg'
import TwitterIcon from "../../media/twitter.svg"
import InstagramIcon from "../../media/instagram.svg"
import Theme from '../../theme'
const drawerWidth = 75

const useStyles = makeStyles((theme) => ({
  imageIcon: {
    height: '100%'
  },
  iconRoot: {
    textAlign: 'center'
  }
}))

export default function CustomDrawer() {
  const classes = useStyles()
  const drawerRef = React.useRef(null)
  const [drawerHeight, setDrawerHeight] = React.useState()
  const [open, setOpen] = React.useState(false)
  const socialConnect = [
    {
      name: 'Mail',
      // icon: <Icons.MAIL_TWO_TONE_ICON style={{color: Theme.palette.primary.main }}/>
      icon: <Icons.MAIL_TWO_TONE_ICON style={{color: 'rgb(55, 125, 255)' }}/>
    },
    {
      name: 'Twitter',
      icon: <Icon className={classes.iconRoot} sx={{ overflow: 'visible' }}>
        <img className={classes.imageIcon} src={TwitterIcon} />
      </Icon>
    },
    {
      name: 'Instagram',
      icon: <Icon className={classes.iconRoot} sx={{ overflow: 'visible' }}>
        <img className={classes.imageIcon} src={InstagramIcon} />
      </Icon>
    },
  ]
  React.useEffect(() => {
    let timer = setInterval(() => setOpen(true), 1)
    return () => {
      clearInterval(timer)
    }
  }, [])

  React.useEffect(() => {
    setDrawerHeight(drawerRef.current && drawerRef.current.clientHeight)
  }, [drawerRef])
  return (
    <Drawer
      variant="persistent"
      sx={{
        width: drawerWidth,
        height: 'fit-content',
        top: `calc(50%)`,
        // paddingTop: `-${drawerHeight / 2}px`,
        marginTop: 0,

        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          height: 'fit-content',
          top: `calc(50%)`,
          // paddingTop: `-${drawerHeight / 2}px`,
          marginTop: 0,
          boxSizing: 'border-box',
          borderRadius: '0 4px 4px 0',
          boxShadow: `0px 2px 4px -1px rgb(0 0 0 / 20%), 0px 4px 5px 0px rgb(0 0 0 / 14%), 0px 1px 10px 0px rgb(0 0 0 / 12%)`
        },
      }}
      open={open}
      transitionDuration={{ enter: 1000 }}
    >
      <Box sx={{ overflow: 'auto' }} ref={drawerRef}>
        <List>
          {socialConnect.map((item, index) => (
            <ListItem key={item.name} disablePadding>
              <Tooltip title={item.name} placement='right'>
                <ListItemButton sx={{padding: '10px 10px'}}>
                  <ListItemIcon sx={{justifyContent: 'center', alignItems: 'center'}}>
                    {item.icon}
                  </ListItemIcon>
                </ListItemButton>
              </Tooltip>
            </ListItem>
          ))}
        </List>
        {/* <Divider />
        <List>
          {['All mail', 'Trash', 'Spam'].map((text, index) => (
            <ListItem key={text} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
              </ListItemButton>
            </ListItem>
          ))}
        </List> */}
      </Box>
    </Drawer>
  )
}
