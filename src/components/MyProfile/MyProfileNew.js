import React from 'react'
import { Box, Button, Card, Container, FormControl, FormHelperText, FormLabel, Grid, InputLabel, MenuItem, NativeSelect, Paper, Radio, RadioGroup, Select, TextField, Typography } from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import FormControlLabel from '@mui/material/FormControlLabel'
import { useForm, Controller } from 'react-hook-form'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { constants } from '../../constants'
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker'
import { yupResolver } from '@hookform/resolvers/yup'
import useValidate from '../../validate'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/material.css'

const useStyles = makeStyles((theme) => ({
  selectorRoot: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    rowGap: 16
  },
  userMobileRegFormRoot: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    rowGap: '1.5rem'
  },
  datePicker: {
    "& .Mui-error": {
      color: '#d32f2f',
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: '#d32f2f'
      }
    }
  },
  inputRoot: {
    '&$disabled': {
      borderColor: 'rgb(102, 218, 237)',
      borderWidth: '2px',
      color: 'rgb(84, 84, 84)'
    },
  },
  disabled: {}
}))

function MyProfileNew(props) {
  const classes = useStyles()
  let schemaObj = { firstname: true, lastname: true, dob: true, gender: true, personWithDisability: props.state.role === '0', community: props.state.role === '0' }
  const validationSchema = useValidate(schemaObj)
  const {
    register,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(validationSchema)
  })
  const onSubmit = async (data) => {
    console.log('data==>', '+' + data.phone)
    props.handleChange('phoneNumber', '+' + data.phone);
  }
  const [focusMobileIF, setFocusMobileIF] = React.useState(false)

  return (
    <Paper sx={{
      backgroundColor: 'rgb(255, 255, 255)',
      color: 'rgb(33, 43, 54)',
      transition: 'box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
      backgroundImage: 'none',
      position: 'relative',
      boxShadow: 'rgb(145 158 171 / 20%) 0px 0px 2px 0px, rgb(145 158 171 / 12%) 0px 12px 24px -4px',
      borderRadius: '16px',
      zIndex: 0,
      padding: '80px 24px'
    }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
        <Grid container>
          <Grid item xs={12} sx={{ display: 'flex' }}>
            <Typography sx={{
              lineHeight: 1.5,
              fontSize: '1.5rem',
              fontFamily: '"Public Sans", sans-serif',
              fontWeight: 600,
              display: 'block',
              textAlign: 'center',
              marginTop: '-54px'
            }}>
              My Details
            </Typography>
          </Grid>
        </Grid>
        <Grid container sx={{ columnGap: '80px !important', rowGap: '32px !important' }}>
          <Grid item md={4} sm={12} xs={12}>
            <TextField
              disabled={true}
              required
              defaultValue={props.state.role === '0' ? 'Shramik' : props.state.role === '1' ? 'Employer' : 'Manager'}
              id={"role"}
              name={"role"}
              label={"Role"}
              fullWidth
              margin="dense"
              {...register("role")}
              error={errors.role ? true : false}
            />
            <Typography variant="inherit" color="textSecondary">
              {errors.email?.message}
            </Typography>
          </Grid>
          <Grid item md={4} sm={12} xs={12}></Grid>
          
          <Grid item md={4} sm={12} xs={12}>
            <TextField
              disabled={true}
              required
              defaultValue={props.state.firstname || ''}
              id={"firstname"}
              name={"firstname"}
              label={"First Name"}
              fullWidth
              margin="dense"
              {...register("firstname")}
              error={errors.firstname ? true : false}
            />
            <Typography variant="inherit" color="textSecondary">
              {errors.firstname?.message}
            </Typography>
          </Grid>
          <Grid item md={4} sm={12} xs={12}>
            <TextField
              disabled={true}
              id="lastname"
              defaultValue={props.state.lastname || ''}
              name="lastname"
              label="Last Name"
              type="lastname"
              fullWidth
              {...register("lastname")}
              margin="dense"
            />
          </Grid>
          <Grid item md={4} sm={12} xs={12}>
            <FormControlLabel
              sx={{ margin: 0, display: 'grid' }}
              control={
                <Controller
                  control={control}
                  name="dob"
                  defaultValue={props.state.dob || ''}
                  inputRef={register()}
                  render={({ field: { onChange, value, name } }) => (
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <MobileDatePicker
                        disabled={true}
                        label="Date Of Birth"
                        openTo="year"
                        views={["year", "month", "day"]}
                        inputFormat="dd-MM-yyyy"
                        showToolbar={false}
                        value={value}
                        onChange={(newValue) => onChange(newValue)}
                        renderInput={(params) =>
                          <TextField {...params} required fullWidth className={classes.datePicker} {...register(name)} error={errors.dob ? true : false} />
                        }
                      />
                    </LocalizationProvider>
                  )}
                />
              }
            />
            <Typography variant="inherit" color="textSecondary">
              {errors.dob?.message}
            </Typography>
          </Grid>
          <Grid item md={4} sm={12} xs={12}>
            <FormControl required sx={{ width: '100%' }}>
              <InputLabel id="select-required-label-gender" error={errors.gender ? true : false}>Gender</InputLabel>
              <Select
                disabled={true}
                id="select-gender"
                label="Gender"
                defaultValue={props.state.gender || ''}
                {...register("gender")}
                error={errors.gender ? true : false}
              >
                {constants.GENDER.map((item, index) => <MenuItem key={item.toLowerCase()} value={item.toLowerCase()}>{item}</MenuItem>)}
              </Select>
            </FormControl>
            <Typography variant="inherit" color="textSecondary">
              {errors.gender?.message}
            </Typography>
          </Grid>
          {props.state.role === '0' && <>
            <Grid item md={4} sm={12} xs={12}>
              <>
                <FormControl required sx={{ width: '100%' }}>
                  <InputLabel id="select-required-label-personWithDisability" error={errors.personWithDisability ? true : false}>Person With Disability</InputLabel>
                  <Select
                    disabled={true}
                    id="select-personWithDisability"
                    label="Person With Disability"
                    defaultValue={props.state.personWithDisability || ''}
                    {...register("personWithDisability")}
                    error={errors.personWithDisability ? true : false}
                  >
                    {constants.PERSON_WITH_DISABILITY.map((item, index) => <MenuItem key={item.toLowerCase()} value={item.toLowerCase()}>{item}</MenuItem>)}
                  </Select>
                </FormControl>
                <Typography variant="inherit" color="textSecondary">
                  {errors.personWithDisability?.message}
                </Typography>
              </>
            </Grid>
            <Grid item md={4} sm={12} xs={12}>
              <>
                <FormControl required sx={{ width: '100%' }}>
                  <InputLabel id="select-label-community" error={errors.community ? true : false}>Community</InputLabel>
                  <Select
                    disabled={true}
                    defaultValue={props.state.community || ''}
                    id="select-community"
                    label="Community"
                    {...register("community")}
                    error={errors.community ? true : false}
                  >
                    {constants.COMMUNITY.map((item, index) => <MenuItem key={item.toLowerCase()} value={item.toLowerCase()}>{item}</MenuItem>)}
                  </Select>
                </FormControl>
                <Typography variant="inherit" color="textSecondary">
                  {errors.community?.message}
                </Typography>
              </>
            </Grid>
          </>}
          <Grid item md={4} sm={12} xs={12}>
            <FormControlLabel
              sx={{ margin: 0, width: '100%' }}
              control={
                <Controller
                  control={control}
                  name="phone"
                  defaultValue="false"
                  inputRef={register()}
                  render={({ field: { onChange, value, name } }) => (
                    <PhoneInput
                      inputProps={{
                        name: name,
                        required: true,
                        autoFocus: true,
                      }}
                      placeholder={'Enter your phone number'}
                      autoFocus={true}
                      disabled={!!props.state.phoneNumber}
                      onlyCountries={['in']}
                      country='in'
                      value={props.state.phoneNumber || value}
                      onChange={(phone) => onChange(phone)}
                      countryCodeEditable={false}
                      inputStyle={focusMobileIF ? {
                        width: '100%',
                        borderColor: '#66DAED',
                        borderWidth: '2px',
                        boxShadow: 'none'
                      } : { width: '100%' }}
                      onFocus={() => setFocusMobileIF(true)}
                      onBlur={() => setFocusMobileIF(false)}
                    />
                  )}
                />
              }
            />
          </Grid>
          {props.state.email && <Grid item md={4} sm={12} xs={12}>
            <TextField
              disabled={true}
              required
              defaultValue={props.state.email || ''}
              id={"email"}
              name={"email"}
              label={"Email"}
              fullWidth
              margin="dense"
              {...register("email")}
              error={errors.email ? true : false}
            />
            <Typography variant="inherit" color="textSecondary">
              {errors.email?.message}
            </Typography>
          </Grid>}
        </Grid>
      </Box>
    </Paper>
  )
}

export default MyProfileNew