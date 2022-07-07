// components/simple-dropzone.component.js
import React from "react";

import Dropzone from 'react-dropzone-uploader'
// import 'react-dropzone-uploader/dist/styles.css'
import { getDroppedOrSelectedFiles } from 'html5-file-selector'
import { Card } from "@mui/material";
import { Icons } from '../shared/Icons'
import { makeStyles } from '@mui/styles'

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
    justifyContent: 'center',
    flex: 1,
    '& .dzu-input': {
      display: 'none'
    },
    '& .dzu-submitButtonContainer': {
      display: 'none'
    },
    '& .dzu-dropzone': {
      textAlign: 'center',
      display: 'flex',
      flexFlow: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '10px 30px'
    },
    '& .dzu-previewContainer': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      paddingBottom: '10px',
      '& .dzu-previewImage': {
        // display: 'none',
        width: '46px',
        height: '40px',
      },
      '& .dzu-previewButton': {
        backgroundImage: ''
      }
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
    cursor: 'pointer',
    width: 'fit-content'
  },
  uploadIcon: {
    marginLeft: '16px'
  }
}))


const SimpleUploader = () => {
  const classes = useStyles()

  const getUploadParams = ({ meta }) => {
    console.log(meta);
    return { url: 'https://httpbin.org/post' }
  }

  const handleChangeStatus = ({ meta, file }, status) => { console.log(status, meta, file); addIcon()}

  const handleSubmit = (files, allFiles) => {
    console.log(files.map(f => f.meta))
    allFiles.forEach(f => f.remove())
  }

  const getFilesFromEvent = e => {
    return new Promise(resolve => {
      getDroppedOrSelectedFiles(e).then(chosenFiles => {
        resolve(chosenFiles.map(f => f.fileObject))
      })
    })
  }

  const InputChooseFile = ({ accept, onFiles, files, getFilesFromEvent }) => {

    const text = files.length > 0 ? 'Add more files' : 'Choose files to upload'

    const buttonStyle = {
      backgroundColor: '#67b0ff',
      color: '#fff',
      cursor: 'pointer',
      // padding: 15,
      borderRadius: 30
    }

    return (
      <label>
        <Card className={`${classes.uploadImageButton}`}>
          Upload Image
          <Icons.CLOUD_UPLOAD_TWO_TONE_ICON className={classes.uploadIcon} />
        </Card>
        <input
          style={{ display: 'none' }}
          type="file"
          accept={accept}
          multiple
          onChange={e => {
            getFilesFromEvent(e).then(chosenFiles => {
              onFiles(chosenFiles)
            })
          }}
        />
      </label>
    )
  }

  const addIcon = () => {
    const eleArr = document.getElementsByClassName('dzu-previewButton')
    console.log('eleArr=>', eleArr)
    if (eleArr && eleArr.length > 0) {
      [...eleArr].forEach((ele) => (
        ele.style = `backgroundImage: ""`
      ))
    }
  }

  return (
    <div className={classes.profilePicBox}>
      <Dropzone
        maxFiles={2}
        accept="image/png, image/jpg, image/jpeg, .pdf"
        maxSizeBytes={50 * 1024 * 1024}
        getUploadParams={getUploadParams}
        onChangeStatus={handleChangeStatus}
        onSubmit={handleSubmit}
        InputComponent={InputChooseFile}
        getFilesFromEvent={getFilesFromEvent}
        classNames
      />
    </div>
  );
};

export default SimpleUploader;