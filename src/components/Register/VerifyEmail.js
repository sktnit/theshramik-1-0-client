import { useConsumer } from "../../AuthContext"
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { makeStyles } from '@mui/styles'
import { resendEmailVerificationLink } from '../../firebase'
const useStyles = makeStyles(() => ({
  verifyEmail: {
    width: '90%',
    maxWidth: '500px',
    boxShadow: '0px 0px 4px hsl(210, 12%, 75%)',
    textAlign: 'center',
    padding: '40px 20px',
    backgroundColor: 'hsl(210, 10%, 98%)'
  },
  verifyEmailHeader: {
    fontWeight: 300,
    marginTop: 0
  },
  verifyEmailDesc: {
    lineHeight: '25px',
  },
  verifyEmailInstruction: {
    color: 'gray'
  },
  verifyEmailButton: {
    marginTop: '35px'
  }
}))

function VerifyEmail(props) {
  const classes = useStyles()
  const { currentUser } = useConsumer()
  const [time, setTime] = useState(60)
  const { timeActive, setTimeActive } = useConsumer()
  const navigate = useNavigate()

  useEffect(() => {
    const interval = setInterval(() => {
      currentUser?.reload()
        .then(() => {
          if (currentUser?.emailVerified) {
            clearInterval(interval)
            navigate('/user-profile')
          }
        })
        .catch((err) => {
          alert(err.message)
        })
    }, 1000)
  }, [navigate, currentUser])

  useEffect(() => {
    let interval = null
    if (timeActive && time !== 0) {
      interval = setInterval(() => {
        setTime((time) => time - 1)
      }, 1000)
    } else if (time === 0) {
      setTimeActive(false)
      setTime(60)
      clearInterval(interval)
    }
    return () => clearInterval(interval)
  }, [timeActive, time, setTimeActive])

  const resendEmailVerification = async () => {
    try {
      await resendEmailVerificationLink()
      setTimeActive(true)
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <>
      <div className={classes.verifyEmail}>
        <h1 className={classes.verifyEmailHeader}>Please Verify your Email Address</h1>
        <p className={classes.verifyEmailDesc}>
          <strong>A Verification email has been sent to:</strong><br />
          <span>{currentUser?.email}</span>
        </p>
        <span className={classes.verifyEmailInstruction}>Follow the instruction in the email to verify your account</span>
        <button className={classes.verifyEmailButton}
          onClick={resendEmailVerification}
          disabled={timeActive}
        >Resend Email {timeActive && time}</button>
      </div>
    </>
  )
}

export default VerifyEmail