import { Container } from '@mui/material'
import React from 'react'
import UserForm from '../shared/UserForm'
import { makeStyles } from '@mui/styles'
import theme from '../../theme'

const useStyles = makeStyles(() => ({
  loginRoot: {
    height: '100vh',
    display: 'flex !important',
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  registerContainer: {
    // padding: '50px 88px 0'
    padding: '20px'
  }
}))

function Login() {
  const classes = useStyles()
  return (
    <div>
      <Container maxWidth="xs" height={'100%'} className={classes.loginRoot}>
        <UserForm login={true}></UserForm>
      </Container>
    </div>
  )
}

export default Login