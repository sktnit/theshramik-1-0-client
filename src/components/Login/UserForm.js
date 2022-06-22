import { Box, Button, Checkbox, FormControlLabel, Grid, TextField, Typography } from '@mui/material'
import React from 'react'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Link, useNavigate, Outlet } from 'react-router-dom'
import { makeStyles } from '@mui/styles'
// import { auth } from '../../firebase'
// import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from 'firebase/auth'
import { useAuthData } from "../../AuthContext"
import { constants } from '../../constants'
import { registerWithEmailAndPassword, logInWithEmailAndPassword, signInWithPhone, verifyOTP } from '../../firebase'
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
  const [loginType, setLoginType] = React.useState('phone')
  const handleChangeLoginType = () => {
    loginType === 'phone' ? setLoginType('email') : setLoginType('phone')
  }
  let schemaObj = { email: true, password: true }
  if (loginType === 'phone') {
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
      await logInWithEmailAndPassword(data.email, data.password)
      currentUser && !currentUser.emailVerified && props.handleChange('showVerifyEmail', true)
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
      navigate("/user-profile")
    }
  }, [currentUser])

  const [focusMobileIF, setFocusMobileIF] = React.useState(true)
  return (

    <Box px={3} py={2}>
      <Typography
        variant="h6"
        align={"left"}
        margin="dense"
      >
        Login
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Grid container spacing={1} style={{ width: 512 }}>

          {loginType === 'phone' &&

            <Grid item xs={12} sm={12}>
              <Box mt={3}>
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
                  fullWidth={true}
                />
              </Box>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div className={classes.horizontalLine}></div>
                <Typography
                  align="center"
                  margin="dense"
                >
                  OR
                </Typography>
                <div className={classes.horizontalLine}></div>
              </div>
              <Box mt={3}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleChangeLoginType}
                  fullWidth={true}
                  style={{ textTransform: 'none' }}
                >
                  Login with Email
                </Button>
              </Box>
            </Grid>
          }
          {loginType === 'email' && <><Grid item xs={12} sm={12}>
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
            <Grid item xs={12} sm={12}>
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
            </Grid></>}

        </Grid>
      </Box>
      {loginType === 'email' &&
        <Box mt={3}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit(onSubmit)}
            fullWidth={true}
            style={{ textTransform: 'none' }}
          >
            Login
          </Button>
        </Box>}
      {loginType === 'email' &&
        <>
          <Box mt={3}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div className={classes.horizontalLine}></div>
              <Typography
                align="center"
                margin="dense"
              >
                OR
              </Typography>
              <div className={classes.horizontalLine}></div>
            </div>
          </Box>
          <Box mt={3}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleChangeLoginType}
              fullWidth={true}
              style={{ textTransform: 'none' }}
            >
              Login with Phone
            </Button>
          </Box>
        </>
      }

      <Box mt={3}>
        {/* <div style={{ display: 'flex', alignItems: 'center' }}>
            <div className={classes.horizontalLine}></div>
            <Typography
              align="center"
              margin="dense"
            >
              OR
            </Typography>
            <div className={classes.horizontalLine}></div>
          </div> */}
        <nav>
          <Typography
            // align="center"
            // margin="dense"
            style={{ fontSize: 14 }}
          >
            Don't have an account?&nbsp;
            <Link
              to={{
                pathname: '/register'
              }}
              className={classes.welcomeButtonTextDecorationNone}
            >
              Register
            </Link>
            <Outlet />
          </Typography>
        </nav>
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