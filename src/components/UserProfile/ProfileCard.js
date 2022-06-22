import React from 'react'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { Avatar, Rating } from '@mui/material'
import { makeStyles } from '@mui/styles'
import Theme from '../../theme'
import { Box } from '@mui/system'
import StarIcon from '@mui/icons-material/Star'
const useStyles = makeStyles(() => ({
  profileCard: {
    '&::before': {
      backdropFilter: 'blur(2px)',
      backgroundColor: 'rgba(0, 82, 73, 0.8)',
      top: '0px',
      zIndex: 9,
      content: '""',
      width: '100%',
      height: '100%',
      position: 'absolute'
    }
  },
  profileCardIntro: {
    left: '0px',
    right: '0px',
    zIndex: 99,
    position: 'absolute',
    marginTop: 40
  }
}))

const labels = {
  0.5: 'Useless',
  1: 'Useless+',
  1.5: 'Poor',
  2: 'Poor+',
  2.5: 'Ok',
  3: 'Ok+',
  3.5: 'Good',
  4: 'Good+',
  4.5: 'Excellent',
  5: 'Excellent+',
}
export default function ProfileCard() {
  const classes = useStyles()
  const value = 5
  return (
    <>
      <Box sx={{ marginBottom: 5 }}>
        <Typography sx={{ fontFamily: 'Open Sans', fontSize: { sm: '1.25rem', md: '1.5rem' }, fontWeight: 700 }}>
          Profile
        </Typography>
      </Box>
      <Card elevation={0} sx={{
        backgroundColor: 'rgb(255, 255, 255)',
        color: 'rgb(33, 43, 54)',
        transition: 'box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
        boxShadow: 'rgb(145 158 171 / 20%) 0px 0px 2px 0px, rgb(145 158 171 / 12%) 0px 12px 24px -4px',
        borderRadius: '16px',
        zIndex: 0,
        marginBottom: '24px',
        height: '280px',
        position: 'relative',
      }}>
        {/* <CardMedia
        component="img"
        image="https://source.unsplash.com/random/780x400"
        alt="green iguana"
      /> */}
        <div className={classes.profileCard}>
          <div className={classes.profileCardIntro}>
            <Avatar
              alt="Remy Sharp"
              src="https://ui-avatars.com/api/?rounded=true"
              // sx={{ width: 56, height: 56 }}
              sx={{
                position: 'relative',
                flexShrink: 0,
                width: { sm: Theme.spacing(9.5), md: Theme.spacing(15.5) },
                height: { sm: Theme.spacing(9.5), md: Theme.spacing(15.5) },
                fontFamily: '"Public Sans", sans-serif',
                fontSize: '1.25rem',
                lineHeight: 1,
                borderRadius: '50%',
                overflow: 'hidden',
                userSelect: 'none',
                marginLeft: 'auto',
                marginRight: 'auto',
                borderWidth: '2px',
                borderStyle: 'solid',
                borderColor: 'rgb(255, 255, 255)',
              }}
            />
            <Box
              sx={{
                marginTop: '8px',
                textAlign: 'center'
              }}
            >
              <Typography
                variant='h4'
                sx={{
                  margin: 0,
                  fontWeight: 700,
                  lineHeight: 1.5,
                  fontSize: '1.25rem',
                  fontFamily: 'Open Sans',
                  color: 'rgb(255, 255, 255)'
                }}
              >
                Shailesh Kumar Thakur
              </Typography>
              <Typography
                variant='body1'
                sx={{
                  margin: 0,
                  lineHeight: 1.5,
                  fontSize: '1rem',
                  fontFamily: 'Open Sans',
                  color: 'rgb(255, 255, 255)',
                  fontWeight: 400,
                  opacity: 0.72
                }}
              >
                Computer Science Engineer
              </Typography>
              <div style={{ marginLeft: 'auto', marginRight: 'auto' }}>
                <Rating
                  name="text-feedback"
                  value={value}
                  readOnly
                  precision={0.5}
                  defaultValue={5}
                  max={5}
                  sx={{ color: 'rgb(255, 255, 255)', marginTop: '8px' }}
                  emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                >
                </Rating>
                {/* <Box sx={{ ml: 2 }}>{labels[value]}</Box> */}
              </div>
            </Box>
          </div>
        </div>
      </Card>
    </>
  )
}
