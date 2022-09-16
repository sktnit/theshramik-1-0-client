import React from 'react'
import AppLayout from '../shared/AppLayout'
import MyProfileNew from '../MyProfile/MyProfileNew'
import ProfileCard from './ProfileCard'
import { useUserData } from '../../AuthContext'
function AboutUs() {
  const { userData } = useUserData()
  return (
    <>
      <AppLayout>
        <ProfileCard state={userData}/>
        <MyProfileNew state={userData}/>
      </AppLayout>
    </>
  )
}

export default AboutUs