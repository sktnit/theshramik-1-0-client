import * as React from 'react'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import makeStyles from '@mui/styles/makeStyles'
import { Icons } from '../shared/Icons'
import Icon from '@mui/material/Icon'
import Tooltip from '@mui/material/Tooltip'
import TwitterIcon from "../../media/twitter.svg"
import InstagramIcon from "../../media/instagram.svg"
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
  // const [drawerHeight, setDrawerHeight] = React.useState()
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
        <img className={classes.imageIcon} src={TwitterIcon} alt=""/>
      </Icon>
    },
    {
      name: 'Instagram',
      icon: <Icon className={classes.iconRoot} sx={{ overflow: 'visible' }}>
        <img className={classes.imageIcon} src={InstagramIcon} alt=""/>
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
    // setDrawerHeight(drawerRef.current && drawerRef.current.clientHeight)
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
