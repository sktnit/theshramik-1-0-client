import Typography from '@mui/material/Typography'
import React, { Suspense } from 'react'
import { makeStyles } from '@mui/styles'
import Box from '@mui/material/Box'
import { CustomButton } from '../shared/CustomButton'
import { Link, useNavigate, Outlet } from 'react-router-dom'
import { Spinner } from '../shared/Spinner'

const AboutUs = React.lazy(() => import('../AboutUs/AboutUs'))
const Login = React.lazy(() => import('../Login/Login'))

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
  welcomeButtons: {
    display: 'flex',
    // justifyContent: 'space-between',
    rowGap: 16,
    columnGap: 16
  },
  welcomeButtonTextDecorationNone: {
    textDecoration: 'none !important'
  }
}));
function Welcome() {
  const classes = useStyles()
  const navigate = useNavigate();
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
    <Suspense fallback={<Spinner/>}>
      <Box className={classes.welcomeRoot}>
        <Typography variant='title'>Welcome To The Shramik</Typography>
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
                fontSize='1.3rem'
                fontFamily='Open Sans'
                width='24ch'
                fontWeight='600'
                onClick={() => navigate(item.link)}
              >
                {item.text}
              </CustomButton>
            </Link>
          ))}
        </nav>
        <Outlet />
      </Box >
    </Suspense>
  )
}

export default Welcome