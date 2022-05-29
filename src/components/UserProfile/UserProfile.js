import React from 'react'
import { useConsumer } from '../../AuthContext'
import { logout } from "../../firebase"
function AboutUs() {
  const { currentUser } = useConsumer()
  console.log(currentUser)
  return (
    <div>
      Hi {currentUser.email}
      <button onClick={logout}>
        Logout
      </button>
    </div>
  )
}

export default AboutUs