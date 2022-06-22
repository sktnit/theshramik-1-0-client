import React from 'react'
import { constants } from '../../constants'
import upperCase from 'lodash/upperCase'
import { makeStyles } from '@mui/styles'
// const { CustomButton } = React.lazy(() => import('../shared/CustomButton'))
import { Card, CardActionArea, CardContent, CardMedia, Typography } from '@mui/material'
import LoginProfileCard from '../UserProfile/LoginProfileCard'

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

export default function UsersSelector(props) {
  const classes = useStyles()

  return (
    <div className={classes.selectorRoot}>
      <LoginProfileCard selected={props.state.userType} handleChange={props.handleChange}/>
    </div>
  )
}