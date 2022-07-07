import React from 'react'
import LandingPage from './LandingPage'
import Slide from '@mui/material/Slide'
import Dialog from '@mui/material/Dialog'
import Box from '@mui/material/Box'
import { useUserData } from '../../AuthContext'
import LoginProfileCard from './LoginProfileCard'
import makeStyles from '@mui/styles/makeStyles'
import { Card, Container, FormControl, FormHelperText, FormLabel, Grid, InputLabel, MenuItem, NativeSelect, Paper, Radio, RadioGroup, Select, TextField, Typography } from '@mui/material'
import useTheme from '@mui/material/styles/useTheme'
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
import { pink } from '@mui/material/colors'
import Dropzone from 'react-dropzone-uploader'
import { Icons } from '../shared/Icons'
import AddProof from './AddProof'
import AlertDialogSlide from './AlertDialogSlide'
// import SimpleUploader from '../shared/SimpleUploader'

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction={props.in ? "left" : "right"} ref={ref} {...props} />
})

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
      color: 'grey',
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: 'rgb(192, 192, 192)'
      }
    }
  }
}))

function Details() {
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

  const handleNext = () => {
    setState(prevState => ({
      ...prevState,
      activeStep: prevState.activeStep + 1
    }))
  }

  const { userData } = useUserData();
  console.log('userData==>', userData)
  const step = 4
  return (
    <LandingPage hideDrawer={true}>
      {
        userData.role === undefined && step === 0 && <AddRole state={state} handleChange={handleChange} />
      }
      {
        userData.phoneNumber === undefined && step === 1 && <AddMobile state={state} handleChange={handleChange} />
      }
      {
        userData.name === undefined && step === 2 && <AddShramikBio state={state} handleChange={handleChange} />
      }
      {
        // userData.name === undefined && step === 3 && <AddPhoto state={state} handleChange={handleChange} />
        userData.name === undefined && step === 3 && <AddPhoto state={state} handleChange={handleChange} />
      }
      {
        // userData.name === undefined && step === 3 && <AddPhoto state={state} handleChange={handleChange} />
        (userData.identityProof === undefined || !Object.keys(userData.identityProof).includes('documentUrl')) && step === 4 && <AddProof state={state} handleChange={handleChange} />
      }
    </LandingPage>
  )
}

function AddRole(props) {
  const classes = useStyles()
  const theme = useTheme()
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
          <LoginProfileCard selected={props.state.userType} handleChange={props.handleChange} />
        </div>
      </Container>
    </AlertDialogSlide>
  )
}

function AddMobile(props) {
  const classes = useStyles()
  const theme = useTheme()
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
    console.log('data==>', '+' + data.phone)
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
                        onlyCountries={['in']}
                        country='in'
                        value={value}
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
              onClick={handleSubmit(onSubmit)}
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

function AddShramikBio(props) {
  const classes = useStyles()
  const theme = useTheme()
  const sm = useMediaQuery((theme) => theme.breakpoints.down('md'))
  let schemaObj = { firstname: true }
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
    try {
      console.log('data==>', data)
    } catch (err) {
      console.log(err)
      console.log(err.message)
    }
  }
  const [value, setValue] = React.useState('')
  const handleChange = (newValue) => {
    setValue(newValue);
  };

  const [gender, setGender] = React.useState('');

  const handleGender = (event) => {
    setGender(event.target.value);
  }
  const [community, setCommunity] = React.useState('');

  const handleCommunity = (event) => {
    setCommunity(event.target.value);
  }
  const [personWithDisablity, setPersonWithDisablity] = React.useState('');

  const handlePersonWithDisablity = (event) => {
    setPersonWithDisablity(event.target.value);
  }

  return (
    <AlertDialogSlide>
      <Container maxWidth='lg' sx={{ margin: sm ? 4 : '0' }}>
        <Paper sx={{
          // padding: '20px',
          backgroundColor: 'rgb(255, 255, 255)',
          color: 'rgb(33, 43, 54)',
          transition: 'box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
          backgroundImage: 'none',
          position: 'relative',
          boxShadow: 'rgb(145 158 171 / 20%) 0px 0px 2px 0px, rgb(145 158 171 / 12%) 0px 12px 24px -4px',
          borderRadius: '16px',
          zIndex: 0,
          padding: '80px 24px'
          // textAlign: 'center'
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Grid container spacing={1} style={{ width: 512 }}>
              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
                <Typography sx={{
                  // margin: '16px auto 0px',
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
                  id={"firstname"}
                  name={"firstname"}
                  label={"First Name"}
                  fullWidth
                  margin="dense"
                  {...register("firstname")}
                  error={errors.email}
                />
                <Typography variant="inherit" color="textSecondary">
                  {errors.email?.message}
                </Typography>
              </Grid>
              <Grid item md={6} sm={12} xs={12}>
                <TextField
                  // required
                  id="lastname"
                  name="lastname"
                  label="Last Name"
                  type="lastname"
                  fullWidth
                  margin="dense"
                />
              </Grid>
              <Grid item md={6} sm={12} xs={12}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <MobileDatePicker
                    label="Date Of Birth"
                    openTo="year"
                    views={["year", "month", "day"]}
                    inputFormat="dd-MM-yyyy"
                    showToolbar={false}
                    value={value}
                    onChange={handleChange}
                    renderInput={(params) => <TextField {...params} required fullWidth className={classes.datePicker} />}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item md={6} sm={12} xs={12}>
                <FormControl required sx={{ width: '100%' }}>
                  <InputLabel id="demo-simple-select-required-label">Gender</InputLabel>
                  <Select
                    id="demo-simple-select"
                    value={gender}
                    label="Gender"
                    onChange={handleGender}
                  >
                    <MenuItem value={'male'}>Male</MenuItem>
                    <MenuItem value={'female'}>Female</MenuItem>
                    <MenuItem value={'Others'}>Others</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item md={6} sm={12} xs={12}>
                <>
                  <FormControl required sx={{ width: '100%' }}>
                    <InputLabel id="demo-simple-select-required-label">Person With Disability</InputLabel>
                    <Select
                      id="demo-simple-select"
                      value={personWithDisablity}
                      label="Person With Disability"
                      onChange={handlePersonWithDisablity}
                    >
                      <MenuItem value={'yes'}>Yes</MenuItem>
                      <MenuItem value={'no'}>No</MenuItem>
                    </Select>
                  </FormControl>
                </>
              </Grid>
              <Grid item md={6} sm={12} xs={12}>
                <>
                  <FormControl required sx={{ width: '100%' }}>
                    <InputLabel id="demo-simple-select-required-label">Community</InputLabel>
                    <Select
                      // defaultValue={'hindu'}
                      id="demo-simple-select"
                      value={community}
                      label="Community"
                      onChange={handleCommunity}
                    >
                      <MenuItem value={'hindu'}>Hindu</MenuItem>
                      <MenuItem value={'muslim'}>Muslim</MenuItem>
                      <MenuItem value={'Others'}>Others</MenuItem>
                    </Select>
                  </FormControl>
                </>
              </Grid>
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

function AddPhoto(props) {
  const classes = useStyles()
  const theme = useTheme()
  const sm = useMediaQuery((theme) => theme.breakpoints.down('md'))
  return (
    <AlertDialogSlide>
      <Container maxWidth='lg' sx={{ margin: sm ? 4 : '0' }}>
        <div className={classes.selectorRoot}>
          <MyProfileNew />
        </div>
      </Container>
    </AlertDialogSlide>
  )
}

// function AddProof(props) {
//  
// }



export default Details