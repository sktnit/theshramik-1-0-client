import { Box, Button, Checkbox, FormControlLabel, Grid, Paper, TextField, Typography } from '@mui/material'
import React from 'react'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import { Link, useNavigate, Outlet } from 'react-router-dom'
import { makeStyles } from '@mui/styles'
// import { auth } from '../../firebase'
// import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from 'firebase/auth'
import { useConsumer } from "../../AuthContext"
import { constants } from '../../constants'
import { registerWithEmailAndPassword, logInWithEmailAndPassword } from '../../firebase'
import useValidate from '../../validate'

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
  }
}))

function UserForm(props) {
  const classes = useStyles()
  const { currentUser } = useConsumer()
  let schemaObj = props.register ? { firstname: true, password: true, confirmPassword: true, acceptTerms: true } : props.login ? { email: true, password: true } : {}
  if (props.register && props.state?.signUpType === 'email') {
    schemaObj.email = true
  }
  if (props.register && props.state?.signUpType === 'phone') {
    schemaObj.phone = true
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
    console.log('data==>', JSON.stringify(data))
    try {
      if (props.register && props.state?.signUpType === 'email') {
        await registerWithEmailAndPassword(data.firstname, data.email, data.password)
        props.handleChange('showVerifyEmail', true)
      }
      if (props.login) {
        await logInWithEmailAndPassword(data.email, data.password)
        currentUser && !currentUser.emailVerified && props.handleChange('showVerifyEmail', true)
      }
    } catch (err) {
      console.log(err)
      alert(err.message)
    }
  }
  const navigate = useNavigate();
  const [verifyEmail, setVerifyEmail] = React.useState(false)
  React.useEffect(() => {
    if (currentUser?.emailVerified) {
      navigate("/user-profile");
    }
  }, [currentUser])
  return (
    <Box px={props.login && 3} py={props.login && 2}>
      <Typography
        variant="h6"
        align={props.login ? "left" : "center"}
        margin="dense"
      >
        {props.login ? 'Login' : <>Hey {props.state?.userType && constants.USER_TYPES_NUM_TO_TEXT_MAPPING[props.state.userType]}! <br />Create Your Account</>}
      </Typography>
      <Grid container spacing={1}>
        {props.register && <><Grid item xs={6} sm={6}>
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
        </>}
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
        <Grid item xs={12} sm={props.login ? 12 : 6}>
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
        {props.register && <>
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
        </>}
      </Grid>
      <Box mt={props.login && 3} style={{ display: !props.login && 'flex', flexDirection: !props.login && 'row-reverse' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit(onSubmit)}
          fullWidth={props.login}
        >
          {props.login ? 'Login' : 'Register'}
        </Button>
      </Box>
      {props.login &&
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
        </Box>}
    </Box>
  )
}

export default UserForm