import React, { useState, useContext } from 'react'
import PropTypes from 'prop-types'
import Avatar from '@material-ui/core/Avatar'
import Container from '@material-ui/core/Container'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Card from '@material-ui/core/Card'
import { makeStyles } from '@material-ui/styles'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import DropDownMenu from '../../actions/DropDownMenu'
import constants from '../../constants/constants'
import { Translate } from 'react-auto-translate'
import Icons from '../../constants/Icons'
import { UserConsumer } from '../../context/UserContext'
import Dropzone from 'react-dropzone-uploader'
import httpHelper from '../../shared/httpHelper'
import urlConstants from '../../constants/urlConstants'
import helper from '../../shared/helper'
import AutoComplete from '../shared/AutoComplete/AutoComplete'
import AppSnackbar from '../../actions/snackbar'
import ImageEditor from '../shared/ImageEditor'
import { useHistory } from 'react-router'
import InputAdornment from '@material-ui/core/InputAdornment'
import LinkedInIcon from '@material-ui/icons/LinkedIn'
import TwitterIcon from '@material-ui/icons/Twitter'
import MediumIcon from '../../Icons/icon_medium.svg'
import Theme from '../../theme'
import CustomLoadingButton from '../shared/Button/CustomLoadingButton'
import { MetaMaskIcon } from '../../constants/svg/MetaMaskIcon'
const useStyles = makeStyles((theme) => ({
  heading: {
    marginLeft: '2px',
    marginRight: '5px',
    color: theme.palette.primary.text,
    fontSize: '20px',
    fontWeight: theme.palette.fontWeight.Bold
  },
  descritpionText: {
    fontFamily: 'rubik',
    letterSpacing: '-0.26px',
    fontSize: '12px'
  },
  personIcon: {
    position: 'relative',
    top: '5px'
  },
  inputFieldLabel: {
    fontSize: '14x',
    color: theme.palette.primary.text
  },
  container: {
    padding: 0
  },
  profilePic: {
    height: '90px',
    width: '90px',
    marginTop: '20px',
    marginLeft: '10px'
  },
  inputFieldBlock: {
    maxWidth: '400px',
    marginTop: '30px'
  },
  inputField: {
    marginTop: '7px',
    maxWidth: '350px',
    '& .MuiOutlinedInput-root': {
      borderRadius: '30px',
      height: '30px'
    },
    '& .MuiTextField-root': {
      width: '100% !important'
    },
    '& .MuiOutlinedInput-input': {
      fontSize: '14px',
      color: theme.palette.black.black2,
      fontFamily: 'Rubik',
      height: '10px',
      letterSpacing: '-0.27px'
    },
    '& .MuiInputAdornment-positionStart': {
      fontSize: '14px',
      color: theme.palette.primary.text,
      letterSpacing: '-0.27px'
    },
    '& .MuiSvgIcon-root': {
      height: '20px',
      width: '20px',
      marginRight: '5px'
    }
  },
  dropDownMenu: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(0.5),
    maxWidth: '350px',
    display: 'flex',
    '& .MuiSelect-selectMenu': {
      minHeight: 'auto'
    },
    '& .MuiOutlinedInput-root': {
      borderRadius: '30px',
      height: '30px',
      border: '1px'
    },
    '& .MuiTextField-root': {
      width: '100% !important'
    },
    '& .MuiOutlinedInput-input': {
      fontSize: '14px',
      padding: '13px 14px',
      color: theme.palette.black.black2,
      height: '10px',
      letterSpacing: '-0.27px'
    },
    '& .MuiSvgIcon-root': {
      color: `${theme.palette.primary.text} !important`,
      backgroundColor: theme.palette.grey.grey8,
      width: '20px',
      borderTopRightRadius: '20px',
      borderBottomRightRadius: '20px'
    },
    '& .MuiSelect-iconOutlined': {
      right: '3px'
    }
  },
  error: {
    width: '.7em',
    color: theme.palette.error.dark,
    marginRight: theme.spacing(0.5),
    marginLeft: theme.spacing(1)
  },
  errorMessage: {
    fontSize: '.8em',
    color: theme.palette.error.dark,
    fontWeight: theme.palette.fontWeight.Book
  },
  dropzone: {
    '& .dzu-dropzone': {
      textAlign: 'center'
    }
  },
  profilePicBox: {
    marginTop: '20px',
    display: 'flex',
    flexFlow: 'column',
    width: '110px',
    '& .dzu-input': {
      display: 'none'
    },
    '& .dzu-dropzone': {
      textAlign: 'center'
    }
  },
  addImageLogo: {
    marginTop: '10px'
  },
  add: {
    fontFamily: 'rubik',
    fontSize: '14px',
    fontWeight: theme.palette.fontWeight.Lite,
    color: theme.palette.primary.text
  },
  imageFormat: {
    fontWeight: '100',
    fontSize: '12px'
  },
  dragDrop: {
    fontFamily: 'rubik',
    fontSize: '12px',
    fontWeight: theme.palette.fontWeight.Lite,
    color: theme.palette.secondary.textButton
  },
  actionButton: {
    float: 'right'
  },
  autoComplete: {
    '& .MuiFormControl-marginDense': {
      marginTop: '0px'
    },
    '& .MuiSvgIcon-root': {
      color: `${theme.palette.primary.text} !important`,
      position: 'relative',
      left: '6px',
      backgroundColor: theme.palette.grey.grey8,
      width: '20px',
      borderTopRightRadius: '20px',
      borderBottomRightRadius: '20px'
    },
    '& .MuiSelect-iconOutlined': {
      right: '3px'
    }
  },
  uploadImageButton: {
    display: 'flex',
    borderRadius: '24px',
    textTransform: 'none',
    color: '#fff',
    backgroundColor: `${theme.palette.primary.main} !important`,
    margin: '10px',
    marginLeft: '0px',
    paddingLeft: '10px',
    height: '25px',
    width: '150px',
    fontSize: '14px',
    alignItems: 'center',
    cursor: 'pointer'
  },
  uploadIcon: {
    paddingLeft: '5px'
  },
  textareaField: {
    maxWidth: '350px',
    marginTop: '10px'
  },
  bioTextarea: {
    '& .MuiOutlinedInput-root': {
      borderRadius: '15px',
      height: '100px',
      fontSize: '12px',
      fontWeight: theme.palette.fontWeight.Lite,
      fontFamily: 'rubik',
      '&::-webkit-scrollbar': {
        width: '0.4em'
      },
      '&::-webkit-scrollbar-track': {
        boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
        webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)'
      },
      '&::-webkit-scrollbar-thumb': {
        backgroundColor: '#BCBCBC',
        borderRadius: '15px'
      }
    }
  },
  textarea: {
    borderRadius: '20px',
    border: `1px solid ${theme.palette.grey.grey1}`,
    height: '100px !important',
    width: '100%'
  },
  textareaFocused: {
    borderRadius: '20px',
    border: '0px',
    height: '100px !important',
    width: '100%'
  }
}))

export default function MyProfileNew () {
  const classes = useStyles()
  const context = useContext(UserConsumer)
  const userData = context.userData
  const history = useHistory()
  const countries = []
  function countryNameGenerator (countryList) {
    countryList.forEach((country) => {
      countries.push(country.split('|')[0])
    })
  }
  countryNameGenerator(constants.COUNTRY_NATIONALITY)
  const [data, setData] = useState({
    firstName: userData.firstName,
    lastName: userData.lastName,
    location: userData.location,
    profilePic: userData.profilePic,
    age: userData.age,
    userId: userData.createdAt,
    countryNationality: userData.countryNationality,
    gender: userData.gender,
    myBio: userData.myBio,
    imagePreviewSrc: '',
    imageUploaded: false,
    profile: '', // profile pic attribute
    languageSelection: userData.languageSelection,
    timeZone: userData.timeZone,
    myHandle: userData.myHandle,
    linkedInLink: userData.linkedInLink,
    twitterLink: userData.twitterLink,
    mediumLink: userData.mediumLink
  })
  const [firstNameError, setFirstNameError] = useState(false)
  const [myHandleError, setMyHandleError] = useState(false)
  const [snackbarParams, setSnackbarParams] = useState({
    showSnackBar: false,
    snackMessage: '',
    snackMessageType: 'error'
  })
  const showSnackBarFunc = (message, type) => {
    setSnackbarParams({
      snackMessage: message,
      snackMessageType: type,
      showSnackBar: true
    })
  }
  const closeSnackbarVisibility = (event) => {
    setSnackbarParams({
      snackMessage: '',
      snackMessageType: 'error',
      showSnackBar: false
    })
  }
  const handleImageEditor = async (type, croppedImg) => {
    if (type === 'save' && croppedImg) {
      setCropperOpen(false)
      setData({
        ...data,
        profilePic: croppedImg,
        imagePreviewSrc: croppedImg
      })
    } else {
      setCropperOpen(false)
    }
  }
  const [waitingForApi, setWaitingForApi] = useState(false)
  const [cropperOpen, setCropperOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  // const handleChange = () => {

  // }
  const handleInputChange = (event, name) => {
    setData({
      ...data,
      [name]: event.target.value
    })
    if (name === 'myHandle') {
      if (event.target.value !== '' && event.target.value.trim() !== '') {
        setMyHandleError(false)
      } else {
        setMyHandleError(true)
      }
    }
  }
  const handleSelectImage = async ({ meta, file, remove }, status) => {
    const logoImage = file
    const validate = await helper.checkFileType(file, constants.IMAGE_KEYWORD)
    if (validate.result) {
      if (status === 'done') {
        const reader = new FileReader()
        reader.readAsDataURL(logoImage)
        reader.onload = async (event) => {
          await setData({
            ...data,
            profilePic: event.target.result,
            imagePreviewSrc: event.target.result,
            imageUploaded: true
          })
          setCropperOpen(true)
        }
        remove()
      }
    } else {
      try {
        remove()
      } catch (e) {
        console.log('Error:', e)
      }
    }
  }

  const handleAutoCompleteChange = (event, name) => {
    setData({
      ...data,
      [name]: event
    })
  }
  const onImageSave = async () => {
    const file = data.imagePreviewSrc
    let getPreSignedUrl
    const teamId = helper.getDomain()

    if (file) {
      const fileExtension = file.split(';')[0].replace(/^data:image\//, '')
      const object = constants.USER_KEYWORD
      const thumbnailUrl = data.userId + '.' + fileExtension
      const fileType = file.split(';')[0].replace(/^data:/, '')
      const data2 = helper.dataURItoBlob(file)

      const params = [
        { param: '{object}', value: object },
        { param: '{thumbnailUrl}', value: thumbnailUrl },
        { param: '{fileType}', value: fileType },
        { param: '{teamId}', value: teamId }
      ]

      try {
        const { preSignedUrl } = await httpHelper.get(urlConstants.getPreSignedUrlUnauthorized, httpHelper.getUri(urlConstants.getPreSignedUrlUnauthorized, params))
        getPreSignedUrl = preSignedUrl
        await helper.uploadImage(getPreSignedUrl, data2, fileType)
        // setData({
        //     ...data,
        //     profile: getPreSignedUrl.split('?')[0] + "?" + Date.now()
        // })
        // let imgObj = { ...data };
        // imgObj['profile'] = getPreSignedUrl.split('?')[0];
        const profilePicUrl = getPreSignedUrl.split('?')[0] + '?' + Date.now()
        return profilePicUrl
      } catch (e) {
        await helper.handleUnauthorizedError(e)
        console.log('Error:', e)
      }
    }
  }
  const validationCheck = () => {
    if (data.firstName &&
      // && data.lastName
      // && data.age
      // && data.location
      // && data.gender
      data.myHandle &&
      data.firstName.trim() &&
      data.myHandle.trim()
      // && data.lastName.trim()
      // && data.age.trim()
      // && data.location.trim()
      // && data.gender.trim()
    ) {
      return true
    } else {
      return false
    }
  }
  const onSave = async () => {
    if (validationCheck()) {
      setWaitingForApi(true)
      setLoading(true)
      const imageUrl = await onImageSave()
      const trimmedData = {}
      Object.keys(data).forEach((el) => {
        if (typeof el !== 'boolean' && el !== 'userId' && el !== 'profilePic' && el !== 'imagePreviewSrc') {
          if (data && data[el] && data[el] !== '' && data[el] !== true) {
            trimmedData[el] = data[el].trim()
          } else if (data && data[el] && data[el] !== '') {
            trimmedData[el] = data[el]
          }
        }
      })
      console.log('trimmedData', trimmedData)
      const params = [{ param: '{teamId}', value: helper.getDomain }]
      const postData = {
        body: {
          updateAttributes: {
            ...trimmedData,
            ...(imageUrl && imageUrl !== '' && imageUrl !== '' ? { profilePic: imageUrl } : {})
          },
          action: constants.ACTION.UPDATE
        }
      }
      const address = helper.metaMaskAddress()
      if (address) {
        postData.body.address = address
      }
      try {
        const res = await httpHelper.put(urlConstants.updateUser, httpHelper.getUri(urlConstants.updateUser, params), postData)
        context.updateUserdata(res)
        if (res && res.profilePic) {
          context.updateUserCheckList('setUpProfilePicture')
        }
        context.updateUserCheckList('setYourHandle')
        setData({
          ...data,
          ...trimmedData
        })
        setWaitingForApi(false)
        setLoading(false)
        setIsSaved(true)
        showSnackBarFunc(constants.SUCCESS_MESSAGE.UPDATE_MY_PROFILE, constants.SUCCESS_MESSAGE.TYPE)
        history.push('/my-profile')
        // if (data.imageUploaded) {
        //     window.location.reload(false);
        // }
        // this.resetData = { ...this.state.data };
      } catch (e) {
        if (e.response && e.response.data.status === 1) {
          setMyHandleError(true)
        }
        console.log('Error:', e)
        setWaitingForApi(false)
        setLoading(false)
        setIsSaved(false)
        showSnackBarFunc(constants.ERROR_MESSAGE.UPDATE_MY_PROFILE, constants.ERROR_MESSAGE.TYPE)
      }
    } else {
      if (
        data.firstName.trim() === ''
        // && data.lastName.trim() === ''
      ) {
        setFirstNameError(true)
        // setLastNameError(true)
      } else if (!data.myHandle || (data.myHandle && data.myHandle.trim() === '')) {
        setMyHandleError(true)
      }
      // else if (data.lastName.trim() === '') {
      //   // setLastNameError(true)
      // }
    }
  }

  return (
    <Container className={classes.container}>
      <span>
        <Icons.PERSON_OUTLINE_TWO_TONE_ICON color="primary" className={classes.personIcon} />
      </span>
      <span className={`${classes.heading} font-family-bold-18`}>
        <Translate>My Details</Translate>
      </span>
      <span className={`${classes.descritpionText} font-family-lite-12`}>
        <Translate>Your personal details help us to evaluate the diversity and inclusivity of proposals and is anonymised when shown publicly.</Translate>
      </span>
      <Grid container>
        <Grid item lg={4}>
          <div className={`${classes.inputFieldLabel} font-family-semi-bold-15`} style={{ marginTop: '20px' }}>
            <Translate>Profile Picture</Translate>
          </div>
          {cropperOpen && (
            <div style={{ position: 'absolute' }}>
              <ImageEditor profilePic={data.imagePreviewSrc} handleImageEditor={handleImageEditor} width={260} height={260} />
            </div>
          )}
          <Avatar className={classes.profilePic} src={data && data.profilePic ? data.profilePic : null} alt="Profile Picture" />
        </Grid>
        <Grid item lg={4}>
          <div className={`${classes.inputFieldLabel} font-family-semi-bold-15`} style={{ marginTop: '20px' }}>
            <Translate>My bio</Translate>
          </div>
          <div className={classes.bioTextarea}>
            <TextField
              id="outlined-basic"
              name="myBio"
              type="text"
              margin="normal"
              required
              fullWidth
              multiline
              rows="5"
              className='input-base-input-font-family-normal-15'
              autoComplete="off"
              value={data.myBio}
              onChange={(event, name) => {
                handleInputChange(event, event.target.name)
              }}
              variant="outlined"
            />
            {/* <TextareaAutosize
                            classes={{ focused: classes.textareaFocused }}
                            onChange={(event, name) => { handleInputChange(event, "myBio") }}
                            className={classes.textarea}
                            maxRows={4}
                            defaultValue={data.myBio}
                            name="textarea"
                            aria-label="maximum height"

                        /> */}
          </div>
          {/* <div className={classes.inputField}>
                        <TextField id="outlined-basic"
                            name="myBio"
                            type="text"
                            size="small"
                            value={data.myBio}
                            onChange={(event, name) => { handleInputChange(event, event.target.name) }}
                            variant="outlined"
                        />
                    </div> */}
        </Grid>
      </Grid>
      <div className={classes.profilePicBox}>
        <Dropzone
          onChangeStatus={handleSelectImage}
          accept="image/*"
          className={classes.dropzone}
          maxFiles={1}
          multiple={false}
          inputContent={
            <>
              <Card className={`${classes.uploadImageButton} font-family-semi-bold-15`}>
                <Translate>Upload Image</Translate>
                <Icons.CLOUD_UPLOAD_ICON className={classes.uploadIcon} />
              </Card>
            </>
          }></Dropzone>
      </div>
      {userData && userData.userName && !userData.userName.includes('@') && <div>
        <MetaMaskIcon width={13} height='auto' />&nbsp;{userData.userName}
      </div>}
      <Grid container spacing={3} className={classes.container}>
        <Grid item lg={4}>
          <div className={classes.inputFieldBlock}>
            <div className={`${classes.inputFieldLabel} font-family-semi-bold-15`}>
              <Translate>First Name*</Translate>
            </div>
            <div className={classes.inputField}>
              <TextField
                id="outlined-basic"
                name="firstName"
                type="text"
                size="small"
                error={firstNameError && !data.firstName}
                value={data.firstName}
                onChange={(event, name) => {
                  handleInputChange(event, event.target.name)
                }}
                className='input-base-input-font-family-normal-15'
                variant="outlined"
                helperText={
                  firstNameError && data.firstName === ''
                    ? (<FormControlLabel
                      control={<Icons.ERROR_ICON className={classes.error} />}
                      label={
                        <span className={classes.errorMessage}>
                          {/* {<FormattedMessage id="emailError" />} */}
                          <Translate>Enter name.</Translate>
                        </span>
                      }
                    />)
                    : ('')
                }
              />
            </div>
          </div>
          <div className={classes.inputFieldBlock}>
            <div className={`${classes.inputFieldLabel} font-family-semi-bold-15`}>
              <Translate>My Handle</Translate>
            </div>
            <div className={classes.inputField}>
              <TextField
                id="outlined-basic"
                name="myHandle"
                type="text"
                size="small"
                value={data.myHandle}
                error={myHandleError && !data.myHandle}
                // value={data.firstName}
                onChange={(event, name) => {
                  handleInputChange(event, event.target.name.trim())
                }}
                className='input-base-input-font-family-normal-15'
                variant="outlined"
                helperText={
                  myHandleError
                    ? (data.myHandle === ''
                        ? (<FormControlLabel
                          control={<Icons.ERROR_ICON className={classes.error} />}
                          label={
                            <span className={classes.errorMessage}>
                              {/* {<FormattedMessage id="emailError" />} */}
                              <Translate>Enter handle.</Translate>
                            </span>
                          }
                        />)
                        : (<FormControlLabel
                          control={<Icons.ERROR_ICON className={classes.error} />}
                          label={
                            <span className={classes.errorMessage}>
                              {/* {<FormattedMessage id="emailError" />} */}
                              <Translate>This handle is not available.</Translate>
                            </span>
                          }
                        />))
                    : ('')
                }
              />
            </div>
          </div>
          <DropDownMenuFormat
            classes={classes}
            // title={<FormattedMessage id="ageTitle" />}
            title={<Translate>Age Range</Translate>}
            options={constants.AGE_INTERVAL_SCALE}
            type="age"
            selectedOption={data.age}
            handleInputChange={handleInputChange}
            name="age"
          // errorStatus={!data.age}
          // errorMessage="Select age."
          />
          {/* <DropDownMenuFormat
                        classes={classes}
                        // title={<FormattedMessage id="ageTitle" />}
                        title={<Translate>My Location</Translate>}
                        options={constants.AGE_INTERVAL_SCALE}
                        type="age"
                        selectedOption={data.location}
                        handleInputChange={handleInputChange}
                        name="age"
                        errorStatus={false}
                        errorMessage="Select age."
                    /> */}
          <AutoCompleteFormat
            classes={classes}
            // title={<FormattedMessage id="locationTitle" />}
            title={<Translate>My Location</Translate>}
            value={data.location}
            options={countries}
            handleAutoCompleteChange={(event, name) => {
              handleAutoCompleteChange(event, name)
            }}
            name="location"
          // errorStatus={!data.location}
          // errorMessage="Select location."
          />
          <div className={classes.inputFieldBlock}>
            <div className={`${classes.inputFieldLabel} font-family-semi-bold-15`}>
              <Translate>Social Profiles</Translate>
            </div>
            <div className={classes.inputField}>
              <TextField
                id="outlined-basic"
                name="linkedInLink"
                type="text"
                size="small"
                error={firstNameError && !data.firstName}
                value={data.linkedInLink}
                onChange={(event, name) => {
                  handleInputChange(event, event.target.name)
                }}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LinkedInIcon htmlColor="#0077b5" />
                      <span className='font-family-normal-15'>Add Linkedin username</span>
                    </InputAdornment>
                  )
                }}
              />
            </div>
            <div className={classes.inputField}>
              <TextField
                id="outlined-basic"
                name="twitterLink"
                type="text"
                size="small"
                error={firstNameError && !data.firstName}
                value={data.twitterLink}
                onChange={(event, name) => {
                  handleInputChange(event, event.target.name)
                }}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <TwitterIcon htmlColor="#1DA1F2" />
                      <span className='font-family-normal-15'>Add Twitter username</span>
                    </InputAdornment>
                  )
                }}
              />
            </div>
            <div className={classes.inputField}>
              <TextField
                id="outlined-basic"
                name="mediumLink"
                type="text"
                size="small"
                error={firstNameError && !data.firstName}
                value={data.mediumLink}
                onChange={(event, name) => {
                  handleInputChange(event, event.target.name)
                }}
                className='input-base-input-font-family-normal-15'
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <img style={{ marginRight: '5px' }} src={MediumIcon} />
                      <span className='font-family-normal-15'>Add Medium username</span>
                    </InputAdornment>
                  )
                }}
              />
            </div>
          </div>
        </Grid>
        <Grid item lg={4} className={classes.rightContainer}>
          <div className={classes.inputFieldBlock}>
            <div className={`${classes.inputFieldLabel} font-family-semi-bold-15`}>
              <Translate>Surname</Translate>
            </div>
            <div className={classes.inputField}>
              <TextField
                id="outlined-basic"
                name="lastName"
                type="text"
                size="small"
                onChange={(event, name) => {
                  handleInputChange(event, event.target.name)
                }}
                className='input-base-input-font-family-normal-15'
                variant="outlined"
                // error={lastNameError && !data.lastName}
                value={data.lastName}
              // helperText={
              //   lastNameError && data.lastName === '' ? (
              //     <FormControlLabel
              //       control={<Icons.ERROR_ICON className={classes.error} />}
              //       label={
              //         <span className={classes.errorMessage}>
              //           {/* {<FormattedMessage id="emailError" />} */}
              //           <Translate>Enter surname.</Translate>
              //         </span>
              //       }
              //     />
              //   ) : (
              //     ''
              //   )
              // }
              />
            </div>
          </div>
          <DropDownMenuFormat
            classes={classes}
            // title={<FormattedMessage id="ageTitle" />}
            title={<Translate>Gender</Translate>}
            options={constants.GENDER}
            type="gender"
            selectedOption={data.gender}
            handleInputChange={handleInputChange}
            name="gender"
          // errorStatus={!data.gender}
          // errorMessage="Select gender."
          />
          <DropDownMenuFormat
            classes={classes}
            // title={<FormattedMessage id="ageTitle" />}
            title={<Translate>Language</Translate>}
            options={constants.LANGUAGE}
            type="languageSelection"
            selectedOption={data.languageSelection}
            handleInputChange={handleInputChange}
            name="languageSelection"
            // errorStatus={!data.languageSelection}
            // errorMessage="Select you language."
          />
          <DropDownMenuFormat
            classes={classes}
            // title={<FormattedMessage id="ageTitle" />}
            title={<Translate>My Timezone</Translate>}
            options={constants.TIME_ZONES_LIST}
            type="timeZone"
            selectedOption={data.timeZone}
            handleInputChange={handleInputChange}
            name="timeZone"
            // errorStatus={!data.timeZone}
            // errorMessage="Select timezone."
          />
        </Grid>
      </Grid>
      {/* <Button onClick={onSave} variant="contained" className={classes.actionButton} color="primary" disabled={waitingForApi}>
        <Translate>Save</Translate>
        <Icons.ARROW_RIGHT_ICON />
      </Button> */}
      <div className={classes.actionButton}>
        <CustomLoadingButton
          isShow={true}
          disabled={(waitingForApi)}
          handleClick={onSave}
          loading={loading}
          buttonText={<>
            <Translate>Save</Translate>
            <Icons.ARROW_RIGHT_ICON />
          </>}
          iconType={isSaved ? 'saved' : 'save'}
          iconColor={Theme.palette.white.white1}
          loadingPosition='start'
          variant='contained'
        />
      </div>
      {snackbarParams.showSnackBar && (
        <AppSnackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center'
          }}
          snackbarType={snackbarParams.snackMessageType}
          showSnackbar={snackbarParams.showSnackBar}
          message={snackbarParams.snackMessage}
          handleClose={closeSnackbarVisibility}
        />
      )}
    </Container>
  )
}

const DropDownMenuFormat = (props) => {
  const classes = useStyles()
  return (
    <div className={classes.inputFieldBlock}>
      <div className={`${classes.inputFieldLabel} font-family-semi-bold-15`}>{props.title}</div>
      <div className={`${classes.textField} ${classes.dropDownMenu}`}>
        <DropDownMenu options={props.options} isDisabled={false} selectedOption={props.selectedOption} type={props.type} handleChange={(type, event, child) => props.handleInputChange(event, type)} />
      </div>
      <div className={`${classes.divError} ${!props.errorStatus ? classes.errorMinHeight : ''}`}>
        {props.errorStatus && (
          <FormControlLabel
            control={<Icons.ERROR_ICON className={classes.error} />}
            label={
              <span className={classes.errorMessage}>
                <Translate>{props.errorMessage}</Translate>
                {/* {<FormattedMessage id={`${props.name}Error`} />} */}
              </span>
            }
          />
        )}
      </div>
    </div>
  )
}

DropDownMenuFormat.propTypes = {
  options: PropTypes.array,
  errorStatus: PropTypes.bool,
  errorMessage: PropTypes.string,
  title: PropTypes.string,
  selectedOption: PropTypes.string,
  type: PropTypes.string,
  handleInputChange: PropTypes.func
}

const AutoCompleteFormat = (props) => {
  const { name } = props
  const classes = useStyles()
  return (
    <div className={classes.inputFieldBlock}>
      <div className={`${classes.inputFieldLabel} font-family-semi-bold-15`}>{props.title}</div>
      <div className={`${classes.inputField} ${classes.autoComplete}`}>
        <AutoComplete options={props.options} value={props.value} className={`${classes.inputField} font-family-normal-15`} onChangeCallback={(e) => props.handleAutoCompleteChange(e, name)} />
      </div>
      <div className={`${classes.divError} ${!props.errorStatus ? classes.errorMinHeight : ''}`}>
        {props.errorStatus && (
          <FormControlLabel
            control={<Icons.ERROR_ICON className={classes.error} />}
            label={
              <span className={classes.errorMessage}>
                <Translate>{props.errorMessage}</Translate>
                {/* {<FormattedMessage id={`${props.name}Error`} />} */}
              </span>
            }
          />
        )}
      </div>
    </div>
  )
}

AutoCompleteFormat.propTypes = {
  name: PropTypes.string,
  options: PropTypes.array,
  value: PropTypes.string,
  errorStatus: PropTypes.bool,
  errorMessage: PropTypes.string,
  title: PropTypes.string,
  handleAutoCompleteChange: PropTypes.func
}
