import React from 'react'
import makeStyles from '@mui/styles/makeStyles'
import Grid from '@mui/material/Grid'
import ShramikIcon from "../../media/shramik.svg"
import ShramikConnectIcon from "../../media/shramikConnect.svg"
import CustomCard from './CustomCard'
import Theme from '../../theme'
const useGridStyles = makeStyles(({ breakpoints }) => ({
  root: {
    justifyContent: 'center',
    [breakpoints.up('md')]: {
      justifyContent: 'center',
    },
  },
}))

export const LoginProfileCard = React.memo(function SolidCard(props) {
  const gridStyles = useGridStyles()
  return (
    <>
      <Grid classes={gridStyles} container spacing={4} wrap={'wrap'}>
        <Grid item>
          <CustomCard
            title={'Become Shramik'}
            image={
              ShramikIcon
            }
            selected = {props.selected === '0'}
            color={Theme.palette.card.yellow}
            onClick={()=>props.handleChange('role', '0')}
          />
        </Grid>
        <Grid item>
          <CustomCard
            title={'Hire Shramik'}
            image={
              ShramikConnectIcon
            }
            selected = {props.selected === '1'}
            color={Theme.palette.card.violet}
            onClick={()=>props.handleChange('role', '1')}
          />
        </Grid>
      </Grid>
    </>
  )
})

export default LoginProfileCard