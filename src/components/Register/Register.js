import React from 'react'
import PropTypes from 'prop-types';

import { ColorlibConnector, ColorlibStepIconRoot } from '../shared/CustomStepper'
import { constants } from '../../constants'
import { Icons } from '../shared/Icons'

import Stepper from '@mui/material/Stepper/Stepper'
import Step from '@mui/material/Step/Step'
import StepLabel from '@mui/material/StepLabel/StepLabel'
import Container from '@mui/material/Container/Container'

import { makeStyles } from '@mui/styles'
import theme from '../../theme'
import UsersSelector from './UserSelector';
import ActionButtons from './ActionButtons';
import UserForm from '../shared/UserForm';
import UserSettings from './UserSettings';
const useStyles = makeStyles(() => ({
  registerRoot: {
    marginTop: 20,
    [theme.breakpoints.down('md')]: {
      marginTop: 10
    }
  },
  registerContainer: {
    // padding: '50px 88px 0'
    padding: '20px'
  }
}))
function ColorlibStepIcon(props) {
  const { active, completed, className } = props;

  const icons = {
    1: <Icons.BADGE_TWO_TONE_ICON style={{ color: 'white' }} />,
    2: <Icons.PERSON_TWO_TONE_ICON style={{ color: 'white' }} />,
    3: <Icons.SETTINGS_ICON style={{ color: 'white' }} />
  }
  return (
    <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
      {icons[String(props.icon)]}
    </ColorlibStepIconRoot>
  );
}

ColorlibStepIcon.propTypes = {
  active: PropTypes.bool,
  className: PropTypes.string,
  completed: PropTypes.bool,
  icon: PropTypes.node,
};

function Register() {
  const classes = useStyles()
  const [state, setState] = React.useState({
    activeStep: 0,
    userType: '0'
  })
  const handleChange = (key, value) => {
    const obj = {
      [key]: value
    }
    setState(prevState => ({
      ...prevState,
      ...obj
    }))
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
  const saveData = async () => {
    console.log("saveData==>", state)
  }
  const handleFinish = async () => {
    await saveData()
  }
  const lastStepIndex = 2
  return (
    <Container maxWidth="sm">
      <div className={classes.registerRoot}>
        <Stepper alternativeLabel activeStep={state.activeStep} connector={<ColorlibConnector />}>
          {constants.REGISTER_STEPS.map((step) => (
            <Step key={step.id}>
              <StepLabel StepIconComponent={ColorlibStepIcon}>{step.label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <div className={classes.registerContainer}>
          {
            state.activeStep === 0 ? <UsersSelector handleChange={handleChange} />
              : state.activeStep === 1 ? <UserForm view={true} register={true}></UserForm>
                : state.activeStep === 2 && <UserSettings />
          }
          <ActionButtons
            handleBack={state.activeStep > 0 && handleBack}
            handleNext={state.activeStep < lastStepIndex && handleNext}
            handleFinish={state.activeStep === lastStepIndex && handleFinish}
          />
        </div>
      </div>
    </Container>
  )
}

export default Register