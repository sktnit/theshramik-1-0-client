import Typography from '@mui/material/Typography'
import React, { Suspense } from 'react'
import makeStyles from '@mui/styles/makeStyles'
import Box from '@mui/material/Box'
import { Link, useNavigate, Outlet } from 'react-router-dom'
import { Spinner } from '../shared/Spinner'

import { CustomButton } from '../shared/CustomButton'
import useMediaQuery from '@mui/material/useMediaQuery/useMediaQuery'
import Theme from '../../theme'

// const { CustomButton } = React.lazy(() => import('../shared/CustomButton'))

const AboutUs = React.lazy(() => import('../AboutUs/AboutUs'))
const Login = React.lazy(() => import('../Login/Login'))
// const Register = React.lazy(() => import('../Register/Register'))

const useStyles = makeStyles((theme) => ({
  welcomeRoot: {
    // backgroundColor: '#C4C4C4',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    rowGap: 32
  },
  welcomeTitleDisplay:{
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      flexDirection: 'column'
    },
  },
  welcomeTitle: {
    [theme.breakpoints.down('sm')]: {
      fontSize: '2rem !important',
      textAlign: 'center'
    },
  },
  welcomeButtons: {
    display: 'flex',
    // justifyContent: 'space-between',
    rowGap: 16,
    columnGap: 16,
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column'
    },
  },
  welcomeButtonTextDecorationNone: {
    textDecoration: 'none !important'
  }
}));
function Welcome() {
  const classes = useStyles()
  const navigate = useNavigate();
  const smallScreen = useMediaQuery((theme) => theme.breakpoints.down('sm'))

  const routes = [
    {
      id: 'aboutUs',
      text: 'About Us',
      link: 'about',
      element: <AboutUs />
    },
    {
      id: 'login',
      text: 'Login',
      link: 'login',
      element: <Login />
    }
  ]
  return (
    <Suspense fallback={<Spinner />}>
      <Box className={classes.welcomeRoot}>
        {smallScreen ?
          <div className={classes.welcomeTitleDisplay}>
            <Typography variant='title' className={classes.welcomeTitle}>Welcome</Typography>
            <Typography variant='title' className={classes.welcomeTitle}>To</Typography>
            <Typography variant='title' className={classes.welcomeTitle}>The Shramik</Typography>
          </div>
          : <Typography variant='title'>Welcome To The Shramik</Typography>}
        <nav className={classes.welcomeButtons}>
          {routes && routes.length > 0 && routes.map(item => (
            <Link
              key={`link${item.id}`}
              to={{
                pathname: item.link
              }}
              className={classes.welcomeButtonTextDecorationNone}
            >
              <CustomButton
                key={`button${item.id}`}
                variant='outlined'
                fontSize={smallScreen ? '1.2rem' : '1.5rem'}
                fontFamily='Open Sans'
                width={smallScreen ? '24ch' : '24ch'}
                fontWeight='600'
                onClick={() => navigate(item.link)}
              >
                {item.text}
              </CustomButton>
            </Link>
          ))}
        </nav>
        <CustomButton
          key={`buttoncreate`}
          // variant='outlined'
          fontcolor={Theme.palette.white.white1}
          fontSize={smallScreen ? '1.2rem' : '1.5rem'}
          fontFamily='Open Sans'
          width={smallScreen ? '24ch' : '32ch'}
          fontWeight='600'
          onClick={() => navigate('register')}
        >
          Create Your Account
        </CustomButton>
        <Outlet />
      </Box >
    </Suspense>
  )
}

export default Welcome