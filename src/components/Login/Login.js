import Container from '@mui/material/Container'
import React from 'react'
import UserForm from './UserForm'
import makeStyles from '@mui/styles/makeStyles'
import Paper from '@mui/material/Paper';
import VerifyEmail from '../Register/VerifyEmail'

const useStyles = makeStyles(() => ({
  loginRoot: {
    height: '100vh',
    display: 'flex !important',
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loginPaper: {
    width: 316
  },
}))

function Login() {
  const classes = useStyles()
  const [state, setState] = React.useState({})
  const handleChange = (key, value) => {
    const obj = {
      [key]: value
    }
    setState(prevState => ({
      ...prevState,
      ...obj
    }))
  }

  return (
    <Container className={classes.loginRoot}>
      {state.showVerifyEmail ?
        <VerifyEmail />
        : <Paper elevation={3} className={classes.loginPaper}>
          <UserForm state={state} handleChange={handleChange}></UserForm>
        </Paper>
      }
    </Container>
  )
}

export default Login