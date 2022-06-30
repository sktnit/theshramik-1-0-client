import React from 'react'
import makeStyles from '@mui/styles/makeStyles'
import ResponsiveAppBar from './NewResponsiveAppBar'
import CustomDrawer from './CustomDrawer'
import AboutLandingPage from './AboutLandingPage'

const drawerWidth = 0
const useStyles = makeStyles((theme) => ({
}))
function AboutUs() {
  const classes = useStyles()
  return (
    <div>
      <ResponsiveAppBar drawerWidth={drawerWidth} open={true}/>
      <CustomDrawer />
      <AboutLandingPage />
    </div>
  )
}

export default AboutUs