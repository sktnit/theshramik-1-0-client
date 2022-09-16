import React from 'react'
import makeStyles from '@mui/styles/makeStyles'
import Grid from '@mui/material/Grid'
import Container from '@mui/material/Container'
import Paper from '@mui/material/Paper'
// import FormControl from '@mui/material/FormControl'
// import Radio from '@mui/material/Radio'
// import RadioGroup from '@mui/material/RadioGroup'
// import FormControlLabel from '@mui/material/FormControlLabel'
import Typography from '@mui/material/RadioGroup'
// import useTheme from '@mui/material/styles/useTheme'
import useMediaQuery from '@mui/material/useMediaQuery/useMediaQuery'
import Button from '@mui/material/Button'
import 'react-phone-input-2/lib/material.css'
import AlertDialogSlide from './AlertDialogSlide'
import Box from '@mui/material/Box'
import AddImage from '../shared/AddImage'
import Theme from '../../theme'
import PropTypes from 'prop-types'
const useStyles = makeStyles((theme) => ({
  dropzone: {
    '& .dzu-dropzone': {
      textAlign: 'center'
    }
  },
  addProofBox: {
    display: 'flex',
    // flexFlow: 'column',
    justifyContent: 'center'
  },
  uploadImageButton: {
    display: 'flex',
    borderRadius: '24px',
    textTransform: 'none',
    color: '#fff',
    backgroundColor: `${theme.palette.primary.main} !important`,
    paddingLeft: '16px',
    paddingRight: '16px',
    paddingTop: '8px',
    paddingBottom: '8px',
    height: '25px',
    fontSize: '14px',
    alignItems: 'center',
    cursor: 'pointer'
  },
  uploadIcon: {
    marginLeft: '16px'
  }
}))
function AddProof(props) {
  const classes = useStyles()
  // const theme = useTheme()
  // const mediumScreen = useMediaQuery((theme) => theme.breakpoints.up('sm'))
  const sm = useMediaQuery((theme) => theme.breakpoints.down('md'))
  const [data, setData] = React.useState({})
  const handleChange = async (key, value) => {
    setData({
      ...data,
      [key]: value
    })
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
                <Box>

                  <Typography sx={{
                    lineHeight: 1.5,
                    fontSize: '1.5rem',
                    fontFamily: '"Public Sans", sans-serif',
                    fontWeight: 600,
                    display: 'block',
                    textAlign: 'center',
                    marginTop: '-54px'
                  }}>
                    Upload Aadhar
                  </Typography>
                  <Typography sx={{
                    lineHeight: 1.5,
                    fontSize: '0.75rem',
                    fontFamily: '"Public Sans", sans-serif',
                    fontWeight: 400,
                    color: 'rgb(99, 115, 129)',
                    display: 'block',
                    textAlign: 'center'
                  }}>
                    For your Address Proof
                  </Typography>
                </Box>
              </Grid>
              <Grid item md={12} sm={12} xs={12}>
                <div className={classes.addProofBox}>
                  <CardComponent key='front' label={'front'} error={data.frontError} title={'Front Image'} imagePreviewSrc={props.state.identityProof && props.state.identityProof.front} handleChange={async (value) => await handleChange('front', value)} />
                  <CardComponent key='back' label={'back'} error={data.backError} title={'Back Image'} imagePreviewSrc={props.state.identityProof && props.state.identityProof.back} handleChange={async (value) => await handleChange('back', value)} />
                  {/* <SimpleUploader /> */}
                </div>
              </Grid>
            </Grid>
          </Box>
          <Box mt={3} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                if (data.front && data.back) {
                  props.handleChange('identityProof', data)
                } else {
                  if (!data.front)
                    handleChange('frontError', true)
                  if (!data.back)
                    handleChange('backError', true)
                }
              }}
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
AddProof.propTypes = {
  handleChange: PropTypes.func,
  state: PropTypes.object
}
const CardComponent = (props) => {
  const { title } = props
  return (
    <div style={{ margin: 8, width: 156 }}>
      {title && <Typography sx={{
        lineHeight: 1.5,
        fontSize: '1rem',
        fontFamily: '"Public Sans", sans-serif',
        fontWeight: 600,
        display: 'block',
        textAlign: 'center'
      }}>
        {title}
      </Typography>}
      <div style={{ border: '2px solid', height: 152, width: 152, borderRadius: 8, display: 'flex', alignItems: 'center', padding: 2, borderColor: `${Theme.palette.primary.main}` }}>
        <AddImage label={props.label} error={props.error} imagePreviewSrc={props.imagePreviewSrc} saveImageCallback={async (image) => await props.handleChange(image)} />
      </div>
      {
        props.error && <Typography variant="inherit" color="textSecondary">
          Upload {props.label} image of Aadhar
        </Typography>
      }
    </div>
  )
}

CardComponent.propTypes = {
  label: PropTypes.any,
  error: PropTypes.any,
  imagePreviewSrc: PropTypes.string,
  handleChange: PropTypes.func
}
export default AddProof