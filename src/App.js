import * as React from 'react'
import './App.css'
import theme from './theme'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import AppRouter from './AppRouter'
import { makeStyles } from '@mui/styles'
import { AuthProvider } from './AuthContext'

const useStyles = makeStyles(theme => ({
  app: {
    width: '100%',
    // height: '100vh',
    margin: 0,
    padding: 0,
    boxSizing: 'border-box'
  }
}))
export default function App() {
  const classes = useStyles()
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className={classes.app}>
          <AppRouter />
        </div>
      </ThemeProvider>
    </AuthProvider>
  );
}