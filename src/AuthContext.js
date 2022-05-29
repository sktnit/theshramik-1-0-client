import React, { useContext } from 'react'
import { Spinner } from './components/shared/Spinner'
import { auth } from './firebase'
import { onAuthStateChanged } from 'firebase/auth'

const AuthContext = React.createContext()

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = React.useState(null)
  const [timeActive, setTimeActive] = React.useState(false)
  const [waitingForAPI, setWaitingForAPI] = React.useState(true)
  React.useEffect(() => {
    (async () => {
      await onAuthStateChanged(auth, (user) => {
        setCurrentUser(user)
        setWaitingForAPI(false)
      })
    })()
  }, [])
  if(waitingForAPI){
    return <Spinner />
  }
  return (
    <AuthContext.Provider value={{currentUser, timeActive, setTimeActive}}>
      {children}
    </AuthContext.Provider>
  )
}

export function useConsumer() {
  return useContext(AuthContext)
}