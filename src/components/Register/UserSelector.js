import * as React from 'react'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormControl from '@mui/material/FormControl'
import useMediaQuery from '@mui/material/useMediaQuery'
import { pink } from '@mui/material/colors'
import { constants } from '../../constants'
import upperCase from 'lodash/upperCase'
import { makeStyles } from '@mui/styles'
import PropTypes from 'prop-types'
import DialogTitle from '@mui/material/DialogTitle'
import Dialog from '@mui/material/Dialog'
import Slide from '@mui/material/Slide'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
// const { CustomButton } = React.lazy(() => import('../shared/CustomButton'))

import { CustomButton } from '../shared/CustomButton'
import { Typography } from '@mui/material'

const useStyles = makeStyles((theme) => ({
  selectorRoot: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    rowGap: 16
  },
  selectorText: {
    fontSize: 20
  }
}))

export default function UsersSelector(props) {
  const classes = useStyles()
  const [userType, setUserType] = React.useState('Employee')
  const handleChange = (event) => {
    setUserType(event.target.value)
    props.handleChange('userType', constants.USER_TYPES[upperCase(event.target.value)])
  }
  const buttons = [
    {
      id: 'phone',
      text: 'Register with Mobile Number'
    },
    {
      id: 'email',
      text: 'Register with Email'
    },
    // {
    //   id: 'create',
    //   text: 'Create Your Account',
    //   link: 'register',
    //   element: <Register />
    // }
  ]
  const mediumScreen = useMediaQuery((theme) => theme.breakpoints.up('sm'))

  const [open, setOpen] = React.useState(false)
  const [signUpType, setSignUpType] = React.useState('')
  const handleClick = (type) => {
    // setOpen(true)
    setSignUpType(type)
    props.handleChange('signUpType', type)
  }

  // const handleClose = () => {
  //   setOpen(false)
  // }
  return (
    <div className={classes.selectorRoot}>
      <Typography
        variant="h6"
        align="center"
        margin="dense"
      >
        Select Account Type
      </Typography>
      <FormControl>
        {/* <FormLabel id="users-radio-buttons">Select User Type</FormLabel> */}
        <RadioGroup
          row={mediumScreen}
          aria-labelledby="users-radio-buttons-group-label"
          value={userType}
          onChange={handleChange}
        >
          {Object.keys(constants.USER_TYPES).map(key => (<FormControlLabel
            value={constants[key]}
            key={constants[key]}
            className={classes.selectorText}
            control={
              <Radio
                sx={{
                  '&.Mui-checked': {
                    color: pink[600],
                    fontSize: 20,
                    "&, & + .MuiFormControlLabel-label": {
                      fontSize: '20px',
                      color: pink[600]
                    }
                  }
                }}
              />
            }
            label={constants[key]}
          />))}
        </RadioGroup>
      </FormControl>
      {buttons && buttons.length > 0 && buttons.map(item => (
        <CustomButton
          key={`button${item.id}`}
          variant='outlined'
          fontSize={mediumScreen ? '1.3rem' : '0.8rem'}
          fontFamily='Open Sans'
          width='30ch'
          fontWeight='600'
          onClick={() => handleClick(item.id)}
        >
          {item.text}
        </CustomButton>
      ))}
       {/* <SimpleDialog 
        open={open}
        onClose={handleClose}
        signUpType={signUpType === 'phone' ? 'Mobile Number' : 'Email'}
        userType={userType}
        handleSubmit={() => props.handleChange('signUpType', signUpType)}
      /> */}
    </div>
  )
}


// const Transition = React.forwardRef(function Transition(props, ref) {
//   return <Slide direction="up" ref={ref} {...props} />
// });

// function SimpleDialog(props) {
//   const { onClose, open, signUpType, userType, handleSubmit } = props

//   const handleClose = () => {
//     onClose()
//   }

//   return (
//     <Dialog
//       onClose={handleClose}
//       open={open}
//       TransitionComponent={Transition}
//       keepMounted
//     >
//       <DialogTitle style={{ textAlign: 'center' }}>Hey {userType}!</DialogTitle>
//       <DialogContent sx={{ paddingBottom: 0 }}>
//         <DialogContentText>
//           You selected {signUpType} to create your Account. Click Continue.
//         </DialogContentText>
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={handleClose}>Cancel</Button>
//         <Button onClick={handleSubmit}>Continue</Button>
//       </DialogActions>
//     </Dialog>
//   )
// }

// SimpleDialog.propTypes = {
//   onClose: PropTypes.func.isRequired,
//   open: PropTypes.bool.isRequired,
//   signUpType: PropTypes.string.isRequired,
//   userType: PropTypes.string.isRequired,
//   handleSubmit: PropTypes.func.isRequired
// }