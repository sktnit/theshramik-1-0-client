import React from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import makeStyles from '@mui/styles/makeStyles'
// import useMediaQuery from '@mui/material/useMediaQuery/useMediaQuery'
// import useTheme from '@mui/material/styles/useTheme'
import ShramikCallingPic from "../../media/shramikPic.svg"
import { Link } from 'react-router-dom'
import { CustomButton } from '../shared/CustomButton'
import Theme from '../../theme'
const useStyles = makeStyles((theme) => ({
  root: {
    // backgroundColor: theme.palette.white.white1,
    color: 'rgb(45, 55, 72)',
    transition: 'box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
    borderRadius: '4px',
    boxShadow: 'none'
  },
  rootBackground: {
    // backgroundColor: 'rgb(247, 249, 252)',
    position: 'relative'
  },
  container: {
    width: '100%',
    margin: '0px auto',
    position: 'relative',
    zIndex: 2,
    maxWidth: '1236px',
    paddingLeft: '16px',
    paddingRight: '16px',
    paddingTop: '92px',
    paddingBottom: '64px',
    [theme.breakpoints.down('sm')]: {
      paddingTop: '64px'
    }
  },
  gridLayout: {
    boxSizing: 'border-box',
    display: 'flex',
    flexFlow: 'row wrap',
    marginTop: '-32px',
    width: 'calc(100% + 32px)',
    marginLeft: '-32px',
    [theme.breakpoints.down('sm')]: {
      width: 'calc(100% + 10px)',
      marginLeft: '-10px',
    }
  },
  leftContainer: {
    boxSizing: 'border-box',
    display: 'flex',
    flexflow: 'row wrap',
    width: 'fit-content',
    margin: '0px',
    flexBasis: '50%',
    '-webkit-box-flex': 0,
    flexGrow: '0',
    maxWidth: '50%',
    '-webkit-box-align': 'center',
    alignItems: 'center',
    // border: '2px solid red'
    [theme.breakpoints.down('sm')]: {
      flexBasis: '100%',
      maxWidth: '100%'
    }
  },
  imageStyle: {
    // [theme.breakpoints.down('sm')]: {
    //   aspectRatio: '16 / 9',
    //   objectFit: 'contain'
    // }
  },
  textDecorationNone: {
    textDecoration: 'none !important'
  }
}))
function AboutLandingPage() {
  const classes = useStyles()
  // const lg = useMediaQuery((theme) => theme.breakpoints.up('lg'))
  // const theme = useTheme()

  return (
    <Container className={classes.root}>
      <Toolbar />
      <Box className={classes.rootBackground}>
        <Box className={classes.container}>
          <Grid container spacing={{ md: 4, sm: 2 }} className={classes.gridLayout}>
            <Grid item sm={12} md={6} className={classes.leftContainer}>
              <Box sx={{ padding: '16px 0 0 16px' }}>
                <Box sx={{ marginBottom: '16px' }}>
                  <Typography variant='h2'
                    sx={{
                      fontFamily: 'Open Sans',
                      fontSize: { md: '3rem', sm: '2.5rem' },
                      lineHeight: 1.2,
                      color: 'rgb(45, 55, 72)',
                      fontWeight: 700
                    }}
                  >
                    Social Platfrom<br /> For Service Seekers.
                  </Typography>
                </Box>
                <Box>
                  <Typography variant='h6'
                    sx={{
                      fontFamily: 'Open Sans',
                      fontSize: { md: '1.25rem', sm: '1rem' },
                      lineHeight: 1.5,
                      color: 'rgb(100, 110, 115)',
                      fontWeight: 400
                    }}
                  >
                    Find your Shramik, book a call and get your work done within time.
                  </Typography>
                </Box>
                <Box sx={{ display: { md: 'none', '600px': 'flex' }, marginTop: '18px'}}>
                  <Link
                    to={{
                      pathname: '/login'
                    }}
                    className={classes.textDecorationNone}
                  >
                    <CustomButton
                      // variant='outlined'
                      fontSize='1.2rem'
                      fontFamily='Open Sans'
                      width='18ch'
                      fontWeight='600'
                      fontcolor={Theme.palette.white.white1}
                    >
                      Login
                    </CustomButton>
                  </Link>
                </Box>
              </Box>
            </Grid>
            <Grid item sm={12} md={6} className={classes.leftContainer}>
              <Box sx={{ padding: '16px 16px 0 0', width: '100% !important'}}>
                <Card sx={{ width: '100%', boxShadow: 'none' }}>
                  <CardMedia
                    component="img"
                    sx={{ width: '100%', height: 'auto' }}
                    className={classes.imageStyle}
                    image={ShramikCallingPic}
                    alt=""
                  />
                </Card>
                {/* <img src={ShramikCallingPic} alt='' style={{ width: '512px', height: '512px' }} /> */}
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  )
}

export default AboutLandingPage