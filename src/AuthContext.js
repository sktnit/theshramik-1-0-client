import React, { useContext } from 'react'
import { Spinner } from './components/shared/Spinner'
import { auth, getUserData } from './firebase'
import { onAuthStateChanged } from 'firebase/auth'
import cloneDeep from 'lodash/cloneDeep'
import { constants } from './constants'

const AuthContext = React.createContext()

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = React.useState(null)
  const [timeActive, setTimeActive] = React.useState(false)
  const [waitingForAPI, setWaitingForAPI] = React.useState(true)
  React.useEffect(() => {
    let listener = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user)
      setWaitingForAPI(false)
    })
    return () => {
      listener()
    }
  }, [])

  if (waitingForAPI) {
    return <Spinner />
  }
  return (
    <AuthContext.Provider value={{ currentUser, timeActive, setTimeActive }}>
      {children}
    </AuthContext.Provider>
  )
}
const UserDataContext = React.createContext()

export function UserDataProvider({ children }) {
  const [userData, setUserData] = React.useState(null)
  const { currentUser } = React.useContext(AuthContext)
  const [waitingForAPI, setWaitingForAPI] = React.useState(!!currentUser)

  React.useEffect(() => {
    if (!currentUser) return
    (async () => {
      let max_count = constants.MAX_COUNT_2
      let newUserData
      do {
        newUserData = (await getUserData(currentUser.uid)).data()
        max_count -= 1
        if (!!newUserData) {
          break
        } else {
          await new Promise(res => { setTimeout(res, 1000); })
        }
      } while (max_count > 0)
      if (newUserData) {
        setUserData(newUserData)
        setWaitingForAPI(false)
      }
    })()
  }, [currentUser])

  if (waitingForAPI) {
    return <Spinner />
  }

  return <UserDataContext.Provider value={{ userData }}>{children}</UserDataContext.Provider>
}

export function useAuthData() {
  return useContext(AuthContext)
}

export function useUserData() {
  return useContext(UserDataContext)
}