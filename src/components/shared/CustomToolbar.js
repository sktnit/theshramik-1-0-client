import React from 'react'
import { styled, useTheme } from '@mui/material/styles'
import MuiToolbar from '@mui/material/Toolbar'
import PropTypes from 'prop-types'

const CustomToolBar = styled(MuiToolbar)(({ theme, style}) => ({
  minHeight: 'auto',
  ...style,
  ...theme.mixins.toolbar,
}))

function CustomToolbar(props) {
  const {style}=props
  const theme = useTheme()
  return (
    <CustomToolBar disableGutters={props.disableGutters} style={style}>
      {props.children}
    </CustomToolBar>
  )
}

CustomToolbar.propTypes = {}

export default CustomToolbar
