import { Dialog } from '@mui/material'
import React from 'react'

function AlertDialogSlide(props) {
    return (
      <Dialog
        fullScreen
        open={true}
        PaperProps={{
          sx: {
            backgroundColor: 'transparent',
            boxShadow: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            maxWidth: 'fit-content',
          }
        }}
      >
        {props.children}
      </Dialog>
    )
  }

export default AlertDialogSlide