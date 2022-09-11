import React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Link, useNavigate, Outlet } from 'react-router-dom'
import makeStyles from '@mui/styles/makeStyles'
// import { auth } from '../../firebase'
// import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from 'firebase/auth'
import { useAuthData } from "../../AuthContext"
import { constants } from '../../constants'
import { registerWithEmailAndPassword, signInWithPhone, verifyOTP } from '../../firebase'
import useValidate from '../../validate'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/material.css'
const useStyles = makeStyles((theme) => ({
  welcomeButtonTextDecorationNone: {
    textDecoration: 'none !important'
  },
  horizontalLine: {
    backgroundColor: 'rgba(var(--b38,219,219,219),1)',
    '-webkit-box-flex': 1,
    '-webkit-flex-grow': 1,
    '-ms-flex-positive': 1,
    flexGrow: 1,
    '-webkit-flex-shrink': 1,
    '-ms-flex-negative': 1,
    flexShrink: 1,
    height: '1px',
  },
  userMobileRegFormRoot: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    rowGap: '1.5rem'
  }
}))

function UserForm(props) {
  const classes = useStyles()
  const { currentUser } = useAuthData()

  let schemaObj = { firstname: true, password: true, confirmPassword: true, acceptTerms: true }
  if (props.state?.signUpType === 'email') {
    schemaObj.email = true
  }
  if (props.state?.signUpType === 'phone') {
    schemaObj = { phone: true }
  }
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
      if (props.state?.signUpType === 'email') {
        await registerWithEmailAndPassword(data.firstname, data.email, data.password, props.state.role)
        props.handleChange('showVerifyEmail', true)
      }
    } catch (err) {
      console.log(err)
      console.log(err.message)
    }
  }

  const navigate = useNavigate()
  const [oTP, setOTP] = React.useState(false)
  const [extended, setExtended] = React.useState(false)

  const handleChange = (e) => {
    setOTP(e.target.value)
  }
  const handleVerifyOTP = () => {
    verifyOTP(oTP)
  }
  const requestOTP = async (data) => {
    await signInWithPhone('+' + data.phone)
    setExtended(true)
  }
  React.useEffect(() => {
    if (
      currentUser && (
        (currentUser.email && currentUser.emailVerified) ||
        (currentUser.phoneNumber && currentUser.providerData.length && currentUser.providerData[0].providerId === 'phone')
      )
    ) {
      navigate("/user-details")
    }
  }, [currentUser])

  const [focusMobileIF, setFocusMobileIF] = React.useState(true)
  return (
    props.state?.signUpType === 'phone' ?
      <UserMobileRegistrationForm
        register={register}
        extended={extended}
        control={control}
        errors={errors}
        handleSubmit={handleSubmit}
        requestOTP={requestOTP}
        focusMobileIF={focusMobileIF}
        setFocusMobileIF={setFocusMobileIF}
        handleChange={handleChange}
        handleVerifyOTP={handleVerifyOTP}
      />
      :
      <Box>
        <Typography
          variant="h6"
          align={"center"}
          margin="dense"
        >
          Hey {props.state?.role && constants.USER_TYPES_MESSAGE[props.state.role]}! <br />Create Your Account
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Grid container spacing={1} style={{ width: 512 }}>
            <Grid item xs={6} sm={6}>
              <TextField
                required
                id="firstname"
                name="firstname"
                label="First Name"
                fullWidth
                margin="dense"
                {...register('firstname')}
                error={errors.firstname ? true : false}
              />
              <Typography variant="inherit" color="textSecondary">
                {errors.firstname?.message}
              </Typography>
            </Grid>
            <Grid item xs={6} sm={6}>
              <TextField
                // required
                id="lastname"
                name="lastname"
                label="Last Name"
                fullWidth
                margin="dense"
              // {...register('lastname')}
              // error={errors.fullname ? true : false}
              />
              {/* <Typography variant="inherit" color="textSecondary">
                {errors.fullname?.message}
              </Typography> */}
            </Grid>

            <Grid item xs={12} sm={12}>
              <TextField
                required
                id={props.state?.signUpType === 'phone' ? "phone" : "email"}
                name={props.state?.signUpType === 'phone' ? "phone" : "email"}
                label={props.state?.signUpType === 'phone' ? "Phone Number" : "Email"}
                fullWidth
                margin="dense"
                {...register(props.state?.signUpType === 'phone' ? "phone" : "email")}
                error={props.state?.signUpType === 'phone' ? errors.phone ? true : false : errors.email ? true : false}
              />
              <Typography variant="inherit" color="textSecondary">
                {props.state?.signUpType === 'phone' ? errors.phone?.message : errors.email?.message}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                id="password"
                name="password"
                label="Password"
                type="password"
                fullWidth
                margin="dense"
                {...register('password')}
                error={errors.password ? true : false}
              />
              <Typography variant="inherit" color="textSecondary">
                {errors.password?.message}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                required
                id="confirmPassword"
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                fullWidth
                margin="dense"
                {...register('confirmPassword')}
                error={errors.confirmPassword ? true : false}
              />
              <Typography variant="inherit" color="textSecondary">
                {errors.confirmPassword?.message}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Controller
                    control={control}
                    name="acceptTerms"
                    defaultValue="false"
                    inputRef={register()}
                    render={({ field: { onChange } }) => (
                      <Checkbox
                        color="primary"
                        onChange={e => onChange(e.target.checked)}
                      />
                    )}
                  />
                }
                label={
                  <Typography color={errors.acceptTerms ? 'error' : 'inherit'}>
                    I have read and agree to the Terms *
                  </Typography>
                }
              />
              <br />
              <Typography variant="inherit" color="textSecondary">
                {errors.acceptTerms
                  ? '(' + errors.acceptTerms.message + ')'
                  : ''}
              </Typography>
            </Grid>
          </Grid>
        </Box>

        <Box style={{ display: 'flex', flexDirection: 'row-reverse' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit(onSubmit)}
            style={{ textTransform: 'none' }}
          >
            Register
          </Button>
        </Box>
      </Box>
  )
}

const UserMobileRegistrationForm = (props) => {
  const {
    register,
    extended,
    control,
    errors,
    handleSubmit,
    requestOTP,
    focusMobileIF,
    setFocusMobileIF,
    handleChange,
    handleVerifyOTP,
    fullWidth
  } = props
  const classes = useStyles()
  return (
    <Box className={classes.userMobileRegFormRoot}>
      {!extended && <>
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
                    disabled={extended}
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
          onClick={handleSubmit(requestOTP)}
          style={{ textTransform: 'none' }}
          fullWidth={fullWidth}
        >
          Get OTP
        </Button>
      </>
      }
      {extended && <><TextField
        required
        id="enterOTP"
        name="enterOTP"
        label="Enter OTP"
        fullWidth={fullWidth}
        onChange={handleChange}
        margin="dense"
      />
        <Button
          variant="contained"
          color="primary"
          onClick={handleVerifyOTP}
          style={{ textTransform: 'none' }}
        >
          Verify OTP
        </Button></>}
      <div id='recaptcha-container'></div>
    </Box>
  )
}
export default UserForm