import React from 'react'
// import useMediaQuery from '@mui/material/useMediaQuery'
import { constants } from '../../constants'
import { makeStyles } from '@mui/styles'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import CustomCard from '../UserProfile/CustomCard'

import Theme from '../../theme'
const useStyles = makeStyles((theme) => ({
  selectorRoot: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    rowGap: 16
  },
  selectorText: {
    fontSize: 20
  }
}))

const useGridStyles = makeStyles(({ breakpoints }) => ({
  root: {
    justifyContent: 'center',
    [breakpoints.up('md')]: {
      justifyContent: 'center',
    },
  },
}))

export default function UsersSelector(props) {
  const classes = useStyles()

  const buttons = [
    {
      id: 'phone',
      text: 'Register with Mobile Number',
      color: Theme.palette.card.new
    },
    {
      id: 'email',
      text: 'Register with Email',
      color: Theme.palette.card.new
    }
  ]
  // const mediumScreen = useMediaQuery((theme) => theme.breakpoints.up('sm'))
  const gridStyles = useGridStyles()

  return (
    <div className={classes.selectorRoot}>
      <Typography
        variant="h6"
        align={props.login ? "left" : "center"}
        margin="dense"
      >
        {props.login ? 'Login' : <>Hey {props.state?.userType && constants.USER_TYPES_MESSAGE[props.state.userType]}!</>}
      </Typography>
      <Grid classes={gridStyles} container spacing={4} wrap={'wrap'}>
        {buttons && buttons.length > 0 && buttons.map(item => (
          <Grid item key={`button${item.id}`}>
            <CustomCard
              title={item.text}
              color={item.color}
              onClick={() => props.handleChange('signUpType', item.id)}
              hideSelected={true}
            />
          </Grid>
        ))}
      </Grid>
    </div>
  )
}