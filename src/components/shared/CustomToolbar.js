import React from 'react'
import styled from '@mui/material/styles/styled'
// import useTheme from '@mui/material/styles/useTheme'
import MuiToolbar from '@mui/material/Toolbar'
import PropTypes from 'prop-types'

const CustomToolBar = styled(MuiToolbar)(({ theme, style}) => ({
  minHeight: 'auto',
  ...style,
  ...theme.mixins.toolbar,
}))

function CustomToolbar(props) {
  const {style}=props
  // const theme = useTheme()
  return (
    <CustomToolBar disableGutters={props.disableGutters} style={style}>
      {props.children}
    </CustomToolBar>
  )
}

CustomToolbar.propTypes = {
  disableGutters: PropTypes.bool,
  children: PropTypes.any
}

export default CustomToolbar
