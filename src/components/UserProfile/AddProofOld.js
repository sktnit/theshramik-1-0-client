import React from 'react'
import makeStyles from '@mui/styles/makeStyles'
import Container from '@mui/material/Container'
import FormControl from '@mui/material/FormControl'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
// import InputLabel from '@mui/material/InputLabel'
// import MenuItem from '@mui/material/MenuItem'
// import Dialog from '@mui/material/Dialog'
// import Card from '@mui/material/Card'
// import FormHelperText from '@mui/material/FormHelperText'
// import FormLabel from '@mui/material/FormLabel'
// import NativeSelect from '@mui/material/NativeSelect'
// import Select from '@mui/material/Select'
// import TextField from '@mui/material/TextField'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import Typography from '@mui/material/Typography'
// import useTheme from '@mui/material/styles/useTheme'
import useMediaQuery from '@mui/material/useMediaQuery/useMediaQuery'
import FormControlLabel from '@mui/material/FormControlLabel'
import Button from '@mui/material/Button'
import 'react-phone-input-2/lib/material.css'
import { pink } from '@mui/material/colors'
import SimpleUploader from '../shared/SimpleUploader'
import AlertDialogSlide from './AlertDialogSlide'
import Box from '@mui/material/Box'


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
function AddProof() {
  const classes = useStyles()
  // const theme = useTheme()
  // const mediumScreen = useMediaQuery((theme) => theme.breakpoints.up('sm'))
  const sm = useMediaQuery((theme) => theme.breakpoints.down('md'))
  const [idProofType, setIdProofType] = React.useState('')

  const handleChange = (event) => {
    setIdProofType(event.target.value)
  }
  // const [data, setData] = React.useState({
  //   imagePreviewSrc: '',
  //   imageUploaded: false,
  //   profile: ''
  // })
  // const handleSelectImage = async ({ meta, file, remove }, status) => {
  //   try {
  //     if (status === 'done') {
  //       const logoImage = file
  //       console.log('file==>', file.name, file.type)
  //       const reader = new FileReader()
  //       reader.readAsDataURL(logoImage)
  //       reader.onload = async (event) => {
  //         await setData({
  //           ...data,
  //           prevProfilePic: data.imagePreviewSrc,
  //           profilePic: event.target.result,
  //           imagePreviewSrc: event.target.result,
  //           imageUploaded: true,
  //           file: file
  //         })
  //       }
  //       remove()
  //     }
  //   } catch (err) {
  //     remove()
  //     console.log('DocumentUploadException', err)
  //   }
  // }

  // const Preview = ({ meta }) => {
  //   const { name, percent, status } = meta
  //   return (
  //     <span style={{ alignSelf: 'flex-start', margin: '10px 3%', fontFamily: 'Helvetica' }}>
  //       {name}, {Math.round(percent)}%, {status}
  //     </span>
  //   )
  // }

  console.log('idProofType==>', idProofType)
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
                    // margin: '16px auto 0px',
                    lineHeight: 1.5,
                    fontSize: '1.5rem',
                    fontFamily: '"Public Sans", sans-serif',
                    fontWeight: 600,
                    display: 'block',
                    textAlign: 'center',
                    marginTop: '-54px'
                  }}>
                    Upload Document
                  </Typography>
                  <Typography sx={{
                    // margin: '16px auto 0px',
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
                <FormControl sx={{ width: '100%' }}>
                  <RadioGroup
                    value={idProofType}
                    onChange={handleChange}
                  >
                    {['Aadhar Card'].map((item, index) => (
                      <><FormControlLabel
                        value={index}
                        key={index}
                        className={classes.selectorText}
                        control={
                          <Radio
                            sx={{
                              '&.Mui-checked': {
                                color: pink[600],
                                fontSize: 20,
                                "&, & + .MuiFormControlLabel-label": {
                                  fontSize: '20px',
                                  color: pink[600]
                                }
                              }
                            }}
                          />
                        }
                        label={item}
                      />
                        {
                          idProofType !== '' && idProofType === index.toString() && <div className={classes.addProofBox}>
                            {/* <Dropzone
                                  onChangeStatus={handleSelectImage}
                                  accept="image/*"
                                  className={classes.dropzone}
                                  maxFiles={2}
                                  multiple={false}
                                  inputContent={<>
                                    <Card className={`${classes.uploadImageButton}`}>
                                      Upload&nbsp;{item}&nbsp;image
                                      <Icons.CLOUD_UPLOAD_TWO_TONE_ICON className={classes.uploadIcon} />
                                    </Card>
                                  </>}>
                                </Dropzone> */}
                            {/* <Dropzone
                                  getUploadParams={getUploadParams}
                                  onSubmit={handleSubmit}
                                  PreviewComponent={Preview}
                                  inputContent={<>
                                    <Card className={`${classes.uploadImageButton}`}>
                                      Upload&nbsp;{item}&nbsp;image
                                      <Icons.CLOUD_UPLOAD_TWO_TONE_ICON className={classes.uploadIcon} />
                                    </Card>
                                  </>}
                                  disabled={files => files.some(f => ['preparing', 'getting_upload_params', 'uploading'].includes(f.meta.status))}
                                /> */}
                            <SimpleUploader />
                          </div>
                        }
                      </>
                    ))}
                  </RadioGroup>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
          <Box mt={3} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="contained"
              color="primary"
              // onClick={handleSubmit(onSubmit)}
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

export default AddProof