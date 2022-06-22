import { Button } from '@mui/material'
import { Box } from '@mui/system'
import React from 'react'
import { Icons } from '../shared/Icons'

function ActionButtons(props) {
  return (
    <div>
      <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
        {props.handleBack &&
          <Button
            color="inherit"
            disabled={props.backDisabled}
            onClick={props.handleBack}
            sx={{ mr: 1, ml: props.marginLeftBB}}
          >
            <Icons.ARROW_LEFT_ICON />&nbsp;Go Back
          </Button>
        }
        <Box sx={{ flex: '1 1 auto' }} />
        {/* {isStepOptional(activeStep) && (
          <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
            Skip
          </Button>
        )} */}

        {props.handleNext &&
          <Button onClick={props.handleNext}>
            Next
          </Button>
        }
        {props.handleRegister &&
          <Button onClick={props.handleRegister}>
            Register
          </Button>
        }
        {props.handleLogin &&
          <Button onClick={props.handleLogin}>
            Login
          </Button>
        }

        {props.handleFinish &&
          <Button onClick={props.handleFinish}>
            Finish
          </Button>
        }
      </Box>
    </div>
  )
}

export default ActionButtons