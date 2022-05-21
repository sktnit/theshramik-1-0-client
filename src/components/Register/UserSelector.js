import * as React from 'react'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormControl from '@mui/material/FormControl'
import useMediaQuery from '@mui/material/useMediaQuery'
import { pink } from '@mui/material/colors'
import { constants } from '../../constants'
import upperCase from 'lodash/upperCase'
export default function UsersSelector(props) {
  const [value, setValue] = React.useState('Employee')
  const handleChange = (event) => {
    setValue(event.target.value)
    props.handleChange('userType', constants.USER_TYPES[upperCase(event.target.value)])
  }
  const viewRow = useMediaQuery((theme) => theme.breakpoints.up('sm'))
  return (
    <FormControl>
      {/* <FormLabel id="users-radio-buttons">Select User Type</FormLabel> */}
      <RadioGroup
        row={viewRow}
        aria-labelledby="users-radio-buttons-group-label"
        value={value}
        // name="radio-buttons-group"
        onChange={handleChange}
      >
        {Object.keys(constants.USER_TYPES).map(key => (<FormControlLabel
          value={constants[key]}
          key={constants[key]}
          control={
            <Radio
              sx={{
                '&.Mui-checked': {
                  color: pink[600],
                  "&, & + .MuiFormControlLabel-label": {
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
  )
}
