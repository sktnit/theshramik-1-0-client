import { Container } from '@mui/material'
import React from 'react'
import UserForm from '../shared/UserForm'
import { makeStyles } from '@mui/styles'
// import theme from '../../theme'
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
    // width: 512
    // marginTop: 20,
    // [theme.breakpoints.down('md')]: {
    //   marginTop: 10
    // },
    // [theme.breakpoints.up('sm')]: {
    //   width: 600,
    //   minHeight: 600
    // }
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
          <UserForm login={true} state={state} handleChange={handleChange}></UserForm>
        </Paper>
      }
    </Container>
  )
}

export default Login