import { Box, Button, Checkbox, FormControlLabel, Grid, Paper, TextField, Typography } from '@mui/material'
import React from 'react'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import { Link, useNavigate, Outlet } from 'react-router-dom'
import { makeStyles } from '@mui/styles'
const useStyles = makeStyles((theme) => ({
  welcomeButtonTextDecorationNone: {
    textDecoration: 'none !important'
  }
}))

function UserForm(props) {
  const classes = useStyles()
  const sQtext = '[^\\x0d\\x22\\x5c\\x80-\\xff]'
  const sDtext = '[^\\x0d\\x5b-\\x5d\\x80-\\xff]'
  const sAtom = '[^\\x00-\\x20\\x22\\x28\\x29\\x2c\\x2e\\x3a-\\x3c\\x3e\\x40\\x5b-\\x5d\\x7f-\\xff]+'
  const sQuotedPair = '\\x5c[\\x00-\\x7f]'
  const sDomainLiteral = '\\x5b(' + sDtext + '|' + sQuotedPair + ')*\\x5d'
  const sQuotedString = '\\x22(' + sQtext + '|' + sQuotedPair + ')*\\x22'
  const sDomain_ref = sAtom
  const sSubDomain = '(' + sDomain_ref + '|' + sDomainLiteral + ')'
  const sWord = '(' + sAtom + '|' + sQuotedString + ')'
  const sDomain = sSubDomain + '(\\x2e' + sSubDomain + ')*'
  const sLocalPart = sWord + '(\\x2e' + sWord + ')*'
  const sAddrSpec = sLocalPart + '\\x40' + sDomain // complete RFC822 email address spec
  const sValidEmail = '^' + sAddrSpec + '$' // as whole string
  const sValidNumber = '^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$'
  const sValidEmailOrNumber = new RegExp(sValidEmail + "|" + sValidNumber)
  const validationSchema = Yup.object().shape({
    firstname: Yup.string().required('Firstname is required'),
    email: Yup.string()
      .required('Email or Phone number is required')
      .matches(
        sValidEmailOrNumber,
        'Email or Phone number is invalid'
      ),
    password: Yup.string()
      .required('Password is required')
      .min(6, 'Password must be at least 6 characters')
      .max(40, 'Password must not exceed 40 characters')
      .matches(
        /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{}:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
        "Password must contain at least 8 characters, one uppercase, one number and one special case character"
      ),
    confirmPassword: Yup.string()
      .required('Confirm Password is required')
      .oneOf([Yup.ref('password'), null], 'Confirm Password does not match'),
    acceptTerms: Yup.bool().oneOf([true], 'Accept Terms is required')
  })
  const {
    register,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(validationSchema)
  })
  const onSubmit = data => {
    console.log(JSON.stringify(data, null, 2))
  }
  return (
    <>
      <Paper style={{ padding: '20px' }}>
        <Box px={3} py={2}>
          <Typography
            variant="h6"
            // align="center"
            margin="dense"
          >
            {props.login ? 'Login' : 'Sign Up'}
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
                id="email"
                name="email"
                label="Email, Phone Number"
                fullWidth
                margin="dense"
                {...register('email')}
                error={errors.email ? true : false}
              />
              <Typography variant="inherit" color="textSecondary">
                {errors.email?.message}
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
          <Box mt={3}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit(onSubmit)}
              fullWidth={props.login}
            >
              {props.login ? 'Login' : 'Register'}
            </Button>
          </Box>
        </Box>
        {props.login &&
          <Box>
            <div style={{ display: 'flex' }} mt={40}>
              <div></div>
              <Typography
                align="center"
                margin="dense"
              >
                OR
              </Typography>
              <div></div>
            </div>
            <Typography
              align="center"
              margin="dense"
              style={{ fontSize: 14 }}
            >
              Don't have an account?
              <nav>
                <Link
                  to={{
                    pathname: '/register'
                  }}
                  className={classes.welcomeButtonTextDecorationNone}
                >
                  Register
                </Link>
              </nav>
              <Outlet />
            </Typography>
          </Box>
        }
      </Paper>
    </>
  )
}

export default UserForm