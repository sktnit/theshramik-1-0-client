import React from 'react'
import LandingPage from './LandingPage'
import Slide from '@mui/material/Slide'
import { Card, CardActionArea, CardContent, CardMedia, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import { useAuthData } from "../../AuthContext"

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction={props.in ? "left" : "right"} ref={ref} {...props} />
})

function Details() {
  const { currentUser } = useAuthData()
  return (
    <LandingPage>
      <AlertDialogSlide />
    </LandingPage>
  )
}


function AlertDialogSlide() {
  const [open, setOpen] = React.useState(true)

  return (
    <Box sx={{ display: 'flex' }}>
    </Box>
  )
}

const CardComponent = (props) => {
  return (
    <Card sx={{ background: '#ffffff !important', margin: '16px', boxShadow: 'rgb(145 158 171 / 20%) 0px 0px 2px 0px, rgb(145 158 171 / 12%) 0px 12px 24px -4px', border: '1px solid rgba(145, 158, 171, 0.24)' }}>
      <CardActionArea>
        <CardContent sx={{ textAlign: 'center' }}>
          <Typography gutterBottom variant="h5" component="div">
            {props.header}
          </Typography>
          {/* <Typography variant="body2" color="text.secondary">
            Lizards are a widespread group of squamate reptiles, with over 6,000
            species, ranging across all continents except Antarctica
          </Typography> */}
        </CardContent>
        <CardMedia
          component="img"
          image={props.image}
          alt="green iguana"
        />
      </CardActionArea>
    </Card>
  )
}

export default Details