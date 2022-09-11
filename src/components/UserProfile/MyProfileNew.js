import React, { useState, useContext } from 'react'
import Avatar from '@mui/material/Avatar'
import Container from '@mui/material/Container'
import Card from '@mui/material/Card'
import { makeStyles } from '@mui/styles'
import Grid from '@mui/material/Grid'
import { Icons } from '../shared/Icons'
import Dropzone from 'react-dropzone-uploader'
import ImageEditor from './ImageEditor'
import { Box, Button, Paper, Typography } from '@mui/material'
// import { checkFileType } from './helper'
import { useUserData } from '../../AuthContext'
import { uploadProfilePic } from '../../firebase'

const useGridStyles = makeStyles(({ breakpoints }) => ({
  root: {
    justifyContent: 'center',
    [breakpoints.up('md')]: {
      justifyContent: 'center',
    },
  },
}))

const useStyles = makeStyles((theme) => ({
  heading: {
    color: theme.palette.primary.text,
    fontSize: '20px',
    fontWeight: theme.palette.fontWeight.Bold
  },
  profilePic: {
    height: '144px',
    width: '144px',
    position: 'relative',
    cursor: 'pointer'
  },
  dropzone: {
    '& .dzu-dropzone': {
      textAlign: 'center'
    }
  },
  profilePicBox: {
    display: 'flex',
    flexFlow: 'column',
    '& .dzu-input': {
      display: 'none'
    },
    '& .dzu-dropzone': {
      textAlign: 'center'
    }
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

export default function MyProfileNew(props) {
  const classes = useStyles()
  const { userData, setUserData } = useUserData()
  const [data, setData] = useState({
    imagePreviewSrc: userData.profilePic || '',
    imageUploaded: false,
    profilePic: userData.profilePic 
  })
  const handleImageEditor = async (type, croppedImg) => {
    const result = await fetch(croppedImg)
    const blob = await result.blob()
    console.log('type==>', type, result, blob, window.URL.createObjectURL(blob))
    if (type === 'save' && croppedImg) {
      setCropperOpen(false)
      try {
        const profilePic = await uploadProfilePic(userData.uid, blob, data.file)
        console.log('profilePic upload==>', profilePic)
        setUserData({
          ...userData,
          profilePic: profilePic
        })
        setData({
          ...data,
          profilePic: profilePic,
          imagePreviewSrc: croppedImg
        })
      } catch (err) {
        console.log('ImageUploadException==>', err)
      }
    } else {
      setData({
        ...data,
        profilePic: data.prevProfilePic,
        imagePreviewSrc: data.prevProfilePic,
        imageUploaded: false,
        file: undefined
      })
      setCropperOpen(false)
    }
  }
  const [cropperOpen, setCropperOpen] = useState(false)
  const handleSelectImage = async ({ meta, file, remove }, status) => {
    const logoImage = file
    try {
      if (status === 'done') {
        const reader = new FileReader()
        reader.readAsDataURL(logoImage)
        reader.onload = async (event) => {
          await setData({
            ...data,
            prevProfilePic: data.imagePreviewSrc,
            profilePic: event.target.result,
            imagePreviewSrc: event.target.result,
            imageUploaded: true,
            file: file
          })
          setCropperOpen(true)
        }
        remove()
      }
    } catch (err) {
      remove()
      console.log('ImageExceptionError', err)
    }
  }

  const gridStyles = useGridStyles()
  console.log('data==>', data)
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
      padding: '80px 24px',
      textAlign: 'center'
    }}>

      <Grid classes={gridStyles} container sx={{ pl: 4, pr: 4, gridRowGap: '20px' }} wrap={'wrap'}>
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
            Add Profile Photo
          </Typography>
        </Grid>
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ position: 'relative' }}>
            <div className={classes.profilePicBox}>
              <Dropzone
                onChangeStatus={handleSelectImage}
                accept="image/png, image/jpeg, image/jpg"
                className={classes.dropzone}
                maxFiles={1}
                multiple={false}
                maxSizeBytes={5242880}
                inputContent={<>
                  <Avatar
                    className={classes.profilePic}
                    src={data && data.imagePreviewSrc ? data.imagePreviewSrc : null}
                    alt="Profile Picture"
                  />
                </>}>
              </Dropzone>
            </div>
            {cropperOpen && (<div style={{ position: 'absolute', top: '-12px', left: '-56px' }}>
              <ImageEditor profilePic={data.imagePreviewSrc} handleImageEditor={handleImageEditor} width={260} height={260} align={'left'} />
            </div>)}
          </div>
        </Grid>
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
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
            Allowed *.jpeg, *.jpg, *.png<br /> max size of 5 MB
          </Typography>
        </Grid>
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
          <div className={classes.profilePicBox}>
            <Dropzone
              onChangeStatus={handleSelectImage}
              accept="image/png, image/jpeg, image/jpg"
              className={classes.dropzone}
              maxFiles={1}
              multiple={false}
              maxSizeBytes={5242880}
              inputContent={<>
                <Card className={`${classes.uploadImageButton}`}>
                  Upload Image
                  <Icons.CLOUD_UPLOAD_TWO_TONE_ICON className={classes.uploadIcon} />
                </Card>
              </>}>
            </Dropzone>
          </div>
        </Grid>
      </Grid>
      <Box mt={3} sx={{ display: 'flex', justifyContent: 'center' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => props.handleChange('profilePic', data.profilePic)}
          style={{ textTransform: 'none' }}
        >
          Save
        </Button>
      </Box>
    </Paper>
  )
}