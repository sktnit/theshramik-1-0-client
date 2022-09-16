import React from 'react'
import AppLayout from '../shared/AppLayout'
// import Slide from '@mui/material/Slide'
import Box from '@mui/material/Box'
import { useAuthData, useUserData } from '../../AuthContext'
import LoginProfileCard from './LoginProfileCard'
import makeStyles from '@mui/styles/makeStyles'
import Container from '@mui/material/Container'
import FormControl from '@mui/material/FormControl'
import Grid from '@mui/material/Grid'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
// import Dialog from '@mui/material/Dialog'
// import Card from '@mui/material/Card'
// import FormHelperText from '@mui/material/FormHelperText'
// import FormLabel from '@mui/material/FormLabel'
// import NativeSelect from '@mui/material/NativeSelect'
// import Radio from '@mui/material/Radio'
// import RadioGroup from '@mui/material/RadioGroup'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
// import useTheme from '@mui/material/styles/useTheme'
import useMediaQuery from '@mui/material/useMediaQuery/useMediaQuery'
import FormControlLabel from '@mui/material/FormControlLabel'
import { useForm, Controller } from 'react-hook-form'
import Button from '@mui/material/Button'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/material.css'
import { yupResolver } from '@hookform/resolvers/yup'
import useValidate from '../../validate'
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import MyProfileNew from './MyProfileNew'
import AddProof from './AddProof'
import AlertDialogSlide from './AlertDialogSlide'
import { constants } from '../../constants'
import { getUserData, updateData } from '../../firebase'
import { useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'

// import SimpleUploader from '../shared/SimpleUploader'

// const Transition = React.forwardRef(function Transition(props, ref) {
//   return <Slide direction={props.in ? "left" : "right"} ref={ref} {...props} />
// })

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
  }
}))

function Details() {
  const { currentUser } = useAuthData()
  const [state, setState] = React.useState({
    activeStep: 0
  })
  const navigate = useNavigate()
  const handleChange = async (key, value) => {
    if (key && value) {
      try {
        if (typeof value === 'object' && key !== 'identityProof') {
          await updateData('User', currentUser.uid, {
            ...value
          })
          setState(prevState => ({
            ...prevState,
            ...value
          }))
        } else {
          await updateData('User', currentUser.uid, {
            [key]: value,
            active: (state.role === '0' && state.activeStep === 4) || (state.role === '1' && state.activeStep === 3),
          })
          setState(prevState => ({
            ...prevState,
            [key]: value
          }))
        }
        if ((state.role === '0' && state.activeStep === 4) || (state.role === '1' && state.activeStep === 3)) {
          navigate('/')
        } else {
          handleNext()
        }
      } catch (e) {
        console.log('Error while Saving', e)
      }
    }
  }

  const handleNext = () => {
    setState(prevState => ({
      ...prevState,
      activeStep: prevState.activeStep + 1
    }))
  }

  const { setUserData } = useUserData()

  React.useEffect(() => {
    (async () => {
      const newUserData = (await getUserData(currentUser.uid)).data()
      setUserData(newUserData)
      setState(prevState => ({
        ...prevState,
        ...newUserData
      }))
    })()
  }, [currentUser.uid])
  const step = state.activeStep
  return (
    <AppLayout hideDrawer={true}>
      {
        step === 0 && <AddRole state={state} handleChange={handleChange} />
      }
      {
        step === 1 && <AddMobile phoneNumber={state.phoneNumber} state={state} handleChange={handleChange} />
      }
      {
        step === 2 && <AddBio state={state} handleChange={handleChange} />
      }
      {
        step === 3 && <AddPhoto state={state} handleChange={handleChange} />
      }
      {
        state.role === '0' && step === 4 && <AddProof state={state} handleChange={handleChange} />
      }
    </AppLayout>
  )
}

function AddRole(props) {
  const classes = useStyles()
  // const theme = useTheme()
  const sm = useMediaQuery((theme) => theme.breakpoints.down('md'))

  return (
    <AlertDialogSlide>
      <Container sx={{ margin: sm ? 4 : '0' }}>
        <Paper
          square
          elevation={0}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: 'center',
            height: 50,
            marginTop: sm ? '120px' : '0',
            pl: 2,
            mb: 4,
            bgcolor: "background.default"
          }}
        >
          <Typography>Select Service Type</Typography>
        </Paper>
        <div className={classes.selectorRoot}>
          <LoginProfileCard selected={props.state.role} handleChange={props.handleChange} />
        </div>
      </Container>
    </AlertDialogSlide>
  )
}
AddRole.propTypes = {
  handleChange: PropTypes.func,
  state: PropTypes.object
}

function AddMobile(props) {
  const classes = useStyles()
  // const theme = useTheme()
  const sm = useMediaQuery((theme) => theme.breakpoints.down('md'))
  const schemaObj = { phone: true }
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
    props.handleChange('phoneNumber', '+' + data.phone);
  }
  const [focusMobileIF, setFocusMobileIF] = React.useState(true)
  return (
    <AlertDialogSlide>
      <Container sx={{ margin: sm ? 4 : '0' }}>
        <Paper
          square
          elevation={0}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: 'center',
            height: 50,
            marginTop: sm ? '120px' : '0',
            pl: 2,
            mb: 4,
            bgcolor: "background.default"
          }}
        >
          <Typography>Enter your phone number</Typography>
        </Paper>

        <div className={classes.selectorRoot}>
          <Box className={classes.userMobileRegFormRoot}>
            <div>
              <FormControlLabel
                sx={{ margin: 0 }}
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
                        disabled={!!props.phoneNumber}
                        onlyCountries={['in']}
                        country='in'
                        value={props.phoneNumber || value}
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
              <Typography variant="inherit" color="error">
                {errors.phone ? <>
                  {errors.phone.message}
                  <br />
                  Format: (+91 XXXXX-XXXXX)
                </>
                  : ''}
              </Typography>
            </div>
            <Button
              variant="contained"
              color="primary"
              onClick={() => props.phoneNumber ? props.handleChange('phoneNumber', props.phoneNumber) : handleSubmit(onSubmit)}
              style={{ textTransform: 'none' }}
            >
              Save
            </Button>
          </Box>
        </div>
      </Container>
    </AlertDialogSlide>
  )
}
AddMobile.propTypes = {
  handleChange: PropTypes.func,
  state: PropTypes.object,
  phoneNumber: PropTypes.string
}

function AddBio(props) {
  const classes = useStyles()
  const sm = useMediaQuery((theme) => theme.breakpoints.down('md'))
  let schemaObj = { firstname: true, lastname: true, dob: true, gender: true, personWithDisability: props.state.role === '0', community: props.state.role === '0' }
  const validationSchema = useValidate(schemaObj)
  const {
    register,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(validationSchema)
  })
  const onSubmit = async (data) => {
    try {
      props.handleChange('userInfo', data)
    } catch (err) {
      console.log(err)
      console.log(err.message)
    }
  }

  return (
    <AlertDialogSlide>
      <Container maxWidth='lg' sx={{ margin: sm ? 4 : '0' }}>
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
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Grid container spacing={1} style={{ width: 512 }}>
              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
                <Typography sx={{
                  lineHeight: 1.5,
                  fontSize: '1.5rem',
                  fontFamily: '"Public Sans", sans-serif',
                  fontWeight: 600,
                  display: 'block',
                  textAlign: 'center',
                  marginTop: '-54px'
                }}>
                  Enter your details
                </Typography>
              </Grid>
              <Grid item md={6} sm={12} xs={12}>
                <TextField
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
              <Grid item md={6} sm={12} xs={12}>
                <TextField
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
              <Grid item md={6} sm={12} xs={12}>
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
              <Grid item md={6} sm={12} xs={12}>
                <FormControl required sx={{ width: '100%' }}>
                  <InputLabel id="select-required-label-gender" error={errors.gender ? true : false}>Gender</InputLabel>
                  <Select
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
                <Grid item md={6} sm={12} xs={12}>
                  <>
                    <FormControl required sx={{ width: '100%' }}>
                      <InputLabel id="select-required-label-personWithDisability" error={errors.personWithDisability ? true : false}>Person With Disability</InputLabel>
                      <Select
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
                <Grid item md={6} sm={12} xs={12}>
                  <>
                    <FormControl required sx={{ width: '100%' }}>
                      <InputLabel id="select-label-community" error={errors.community ? true : false}>Community</InputLabel>
                      <Select
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
            </Grid>
          </Box>
          <Box mt={3} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit(onSubmit)}
              style={{ textTransform: 'none' }}
            >
              Save
            </Button>
          </Box>
        </Paper>
      </Container>
    </AlertDialogSlide>
  )
}

AddBio.propTypes = {
  handleChange: PropTypes.func,
  state: PropTypes.object
}

function AddPhoto(props) {
  const classes = useStyles()
  // const theme = useTheme()
  const sm = useMediaQuery((theme) => theme.breakpoints.down('md'))
  return (
    <AlertDialogSlide>
      <Container maxWidth='lg' sx={{ margin: sm ? 4 : '0' }}>
        <div className={classes.selectorRoot}>
          <MyProfileNew handleChange={props.handleChange} />
        </div>
      </Container>
    </AlertDialogSlide>
  )
}

AddPhoto.propTypes = {
  handleChange: PropTypes.func
}

export default Details