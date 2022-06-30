import React from 'react'
import makeStyles from '@mui/styles/makeStyles'
import Typography from '@mui/material/Typography'
import CardActionArea from '@mui/material/CardActionArea'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Box from '@mui/material/Box'
import CheckIcon from '@mui/icons-material/Check';
const useStyles = makeStyles(() => ({
  actionArea: {
    borderRadius: 16,
    transition: '0.2s',
    '&:hover': {
      transform: 'scale(1.1)',
    },
  },
  card: ({ color }) => ({
    width: 252,
    // maxWidth: 312,
    maxHeight: 354,
    borderRadius: 16,
    // boxShadow: 'none',
    // margin: '1rem',
    position: 'relative',
    boxShadow: `0 6px 12px 0 ${color}`,
    '&:hover': {
      boxShadow: `0 6px 12px 0 ${color}`
      // .rotate(-12)
      // .darken(0.2)
      // .fade(0.5)}`,
    },
  }),
  content: ({ color }) => {
    return {
      backgroundColor: color,
      // padding: '1rem 1.5rem 1.5rem',
    }
  },
  title: {
    fontFamily: 'Keania One',
    // fontFamily: 'Open Sans',
    fontSize: '1.5rem',
    color: '#fff',
    textTransform: 'uppercase',
  },
  subtitle: {
    fontFamily: 'Montserrat',
    color: '#fff',
    opacity: 0.87,
    marginTop: '2rem',
    fontWeight: 500,
    fontSize: 14,
  },
  footer: {
    position: 'absolute',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    bottom: '12px'
  },
  circle: ({ color }) => ({
    width: 24,
    height: 24,
    borderRadius: '50%',
    border: `2px solid ${color}`,
    display: 'flex',
    justifyContent: 'center',
  }),
  circle2: ({ color }) => ({
    width: 20,
    height: 20,
    borderRadius: '50%',
    border: `2px solid white`,
    backgroundColor: color,
    display: 'flex',
    justifyContent: 'center',
  }),
  checkIcon: {
    color: '#ffffff !important',
    width: '16px',
    height: '16px'
  }
}))

const CustomCard = ({ image, title, color, subtitle, onClick, selected, hideSelected }) => {
  const classes = useStyles({ color: color })
  const [hovered, setHovered] = React.useState(false)

  return (
    <Box
      sx={{ margin: { md: '1rem', sm: '0.8rem, 2rem' } }}
      onMouseEnter={()=>setHovered(true)}
      onMouseLeave={()=>setHovered(false)}
    >
      <CardActionArea className={classes.actionArea} onClick={onClick}>
        <Card className={classes.card} style={{ border: selected && `2px solid ${color}` }}>
          <CardContent className={classes.content}>
            <Typography className={classes.title} variant={'h2'}>
              {title}
            </Typography>
          </CardContent>
          <CardMedia component="img" image={image} />
          {!hideSelected && <Box className={classes.footer}>
            <div className={classes.circle}>
              {(selected || hovered) &&
                <div className={classes.circle2}>
                  <CheckIcon className={classes.checkIcon} />
                </div>
              }
            </div>
          </Box>}
        </Card>
      </CardActionArea>
    </Box>
  )
}

export default CustomCard

// const styles2 = useStyles({ color: '#203f52' })
// const styles = useStyles({ color: '#ff9900' })
// const styles2 = useStyles({ color: '#4d137f' })
// const styles2 = useStyles({ color: '#34241e' })