import * as React from 'react'
import './App.css'
import theme from './theme'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import AppRouter from './AppRouter'
import { AuthProvider, UserDataProvider } from './AuthContext'
import { StyledEngineProvider } from '@mui/material/styles';

export default function App() {
  return (
    <AuthProvider>
      <UserDataProvider>
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <AppRouter />
          </ThemeProvider>
        </StyledEngineProvider>
      </UserDataProvider>
    </AuthProvider>
  );
}