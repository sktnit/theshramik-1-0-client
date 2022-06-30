import React from 'react'
import PropTypes from 'prop-types'

import { ColorlibConnector, ColorlibStepIconRoot } from '../shared/CustomStepper'
import { constants } from '../../constants'
import { Icons } from '../shared/Icons'

import Stepper from '@mui/material/Stepper/Stepper'
import Step from '@mui/material/Step/Step'
import StepLabel from '@mui/material/StepLabel/StepLabel'
import Container from '@mui/material/Container/Container'

import makeStyles from '@mui/styles/makeStyles'
import theme from '../../theme'
import UsersSelector from './NewUserSelector'
import ActionButtons from './ActionButtons'
import UserForm from './UserForm'
import UserSettings from './UserSettings'
import Paper from '@mui/material/Paper'
import VerifyEmail from './VerifyEmail'
import Box from '@mui/material/Box'

const useStyles = makeStyles(() => ({
  root: {
    minHeight: '100vh',
    overflow: 'auto',
    display: 'flex !important',
    justifyContent: 'center',
    alignItems: 'center'
  },
  registerRoot: {
    padding: 20,
    [theme.breakpoints.up('sm')]: {
      width: 650
    }
  },
  registerContent: {
    paddingTop: '20px'
  }
}))
function ColorlibStepIcon(props) {
  const { active, completed, className } = props

  const icons = {
    1: <Icons.BADGE_TWO_TONE_ICON style={{ color: 'white' }} />,
    2: <Icons.PERSON_TWO_TONE_ICON style={{ color: 'white' }} />,
    3: <Icons.SETTINGS_ICON style={{ color: 'white' }} />
  }
  return (
    <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
      {icons[String(props.icon)]}
    </ColorlibStepIconRoot>
  )
}

ColorlibStepIcon.propTypes = {
  active: PropTypes.bool,
  className: PropTypes.string,
  completed: PropTypes.bool,
  icon: PropTypes.node,
}

function NewRegister() {
  const classes = useStyles()
  const [state, setState] = React.useState({
    activeStep: 0
  })
  const handleChange = (key, value) => {
    const obj = {
      [key]: value
    }
    setState(prevState => ({
      ...prevState,
      ...obj
    }))
    if (key === 'userType' || key === 'signUpType') handleNext()
  }
  const handleBack = () => {
    setState(prevState => ({
      ...prevState,
      activeStep: prevState.activeStep - 1
    }))
  }
  const handleNext = () => {
    setState(prevState => ({
      ...prevState,
      activeStep: prevState.activeStep + 1
    }))
  }
  
  // const lastStepIndex = 2
  return (
    <Container className={classes.root}>
      {state.showVerifyEmail ?
        <VerifyEmail />
        : <Paper elevation={0} className={classes.registerRoot}>
          <Box sx={{ marginBottom: '1rem' }}>
            <Stepper alternativeLabel activeStep={state.activeStep} connector={<ColorlibConnector />}>
              {constants.REGISTER_STEPS.map((step, index) => (
                <Step key={`steps${index}`}>
                  <StepLabel StepIconComponent={ColorlibStepIcon}>{step.label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>
          <div className={classes.registerContent}>
            {
              state.activeStep === 0 ? <UsersSelector state={state} handleChange={handleChange} />
                : state.activeStep === 1 ? <UserSettings state={state} handleChange={handleChange}/>
                  : state.activeStep === 2 && <UserForm state={state} handleChange={handleChange} view={true}/>
            }
            <div style={{ margin: state.activeStep === 2 && state.signUpType !== 'phone' && '-50px 0 0 -16px' }}>
              <ActionButtons
                handleBack={state.activeStep > 0 && handleBack}
                // marginLeftBB={state.activeStep === 1 && 5}
              // handleNext={state.activeStep === 0 && handleNext}
              // handleRegister={state.activeStep > 0  && state.activeStep < lastStepIndex && handleRegister}
              // handleFinish={state.activeStep === lastStepIndex && handleFinish}
              />
            </div>
          </div>
        </Paper>
      }
    </Container>
  )
}

export default NewRegister