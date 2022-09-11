import React, { useState, useContext } from 'react'
import Avatar from '@mui/material/Avatar'
import Container from '@mui/material/Container'
import Card from '@mui/material/Card'
import { makeStyles } from '@mui/styles'
import Grid from '@mui/material/Grid'
import { Icons } from '../shared/Icons'
import Dropzone from 'react-dropzone-uploader'
import ImageEditor from '../UserProfile/ImageEditor'
import { Paper, Typography } from '@mui/material'
// import { checkFileType } from './helper'
import { useUserData } from '../../AuthContext'
import { uploadFile } from '../../firebase'

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
    maxHeight: 144,
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

export default function AddImage(props) {
  const { imagePreviewSrc, saveImageCallback, cropperRequired, label, error } = props
  const classes = useStyles()
  // const { userData } = useUserData()
  const [data, setData] = useState({
    imagePreviewSrc: imagePreviewSrc || '',
    imageUploaded: false
  })
  const [cropperOpen, setCropperOpen] = useState(false)
  const handleImageEditor = async (type, croppedImg) => {
    const result = await fetch(croppedImg)
    const blob = await result.blob()
    console.log('type==>', type, result, blob, window.URL.createObjectURL(blob))
    if (type === 'save' && croppedImg) {
      setCropperOpen(false)
      setData({
        ...data,
        profilePic: croppedImg,
        imagePreviewSrc: croppedImg
      })
      saveImageCallback && await saveImageCallback(data);
      // try {
      //   const profilePic = await uploadProfilePic(userData.uid, blob, data.file)
      //   console.log('profilePic upload==>', profilePic)
      //   setUserData({
      //     ...userData,
      //     profilePic: profilePic
      //   })
      // } catch (err) {
      //   console.log('ImageUploadException==>', err)
      // }
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
  const handleSelectImage = async ({ meta, file, remove }, status) => {
    const logoImage = file
    console.log('File==>', file, file.downloadURL)
    try {
      if (status === 'done') {
        const reader = new FileReader()
        reader.readAsDataURL(logoImage)
        reader.onload = async (event) => {
          cropperRequired && setCropperOpen(true)
          const newData = {
            prevProfilePic: data.imagePreviewSrc,
            profilePic: event.target.result,
            imagePreviewSrc: event.target.result,
            imageUploaded: true,
            file: file
          }
          await setData(prevData => ({
            ...prevData,
            ...newData
          }))
          if (!cropperRequired) {
            try {
              const profilePic = await uploadFile('documents', file, file, label)
              await setData(prevData => ({
                ...prevData,
                profilePic: profilePic,
                imagePreviewSrc: profilePic,
              }))
              console.log('profilePic upload==>', profilePic)
              saveImageCallback && await saveImageCallback(profilePic)
            } catch (err) {
              console.log('ImageUploadException==>', err)
            }
          }
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
    <>
      <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{ position: 'relative' }}>
          <div className={classes.profilePicBox}>
            <Dropzone
              onChangeStatus={handleSelectImage}
              accept="image/png, image/jpeg, image/jpg"
              className={classes.dropzone}
              maxFiles={1}
              multiple={false}
              maxSizeBytes={10495760}
              inputContent={
                data && data.imagePreviewSrc ? <img src={data.imagePreviewSrc} alt="" className={classes.profilePic} /> : <>
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
                  <Card className={`${classes.uploadImageButton}`} style={{ fontSize: '12px', marginTop: '24px' }}>
                    Upload Image
                    <Icons.CLOUD_UPLOAD_TWO_TONE_ICON className={classes.uploadIcon} style={{ fontSize: '16px' }} />
                  </Card>
                </>}>
            </Dropzone>
          </div>
          {cropperRequired && cropperOpen && (<div style={{ position: 'absolute', top: '-12px', left: '-56px' }}>
            <ImageEditor profilePic={data.imagePreviewSrc} handleImageEditor={handleImageEditor} width={260} height={260} align={'left'} />
          </div>)}
        </div>
      </Grid>
    </>
  )
}