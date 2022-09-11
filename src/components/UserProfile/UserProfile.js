import React from 'react'
import LandingPage from '../shared/LandingPage'
import MyProfileNew from '../MyProfile/MyProfileNew'
import ProfileCard from './ProfileCard'
import { useUserData } from '../../AuthContext'
function AboutUs() {
  const { userData } = useUserData()
  return (
    <>
      <LandingPage>
        <ProfileCard state={userData}/>
        <MyProfileNew state={userData}/>
      </LandingPage>
    </>
  )
}

export default AboutUs