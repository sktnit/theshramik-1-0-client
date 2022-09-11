import Avatar from '@material-ui/core/Avatar'
import PropTypes from 'prop-types'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Container from '@material-ui/core/Container'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import { withStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import React, { Component } from 'react'
import { Translate } from 'react-auto-translate'
import { StickyContainer } from 'react-sticky'
import DropDownMenu from '../../actions/DropDownMenu'
import AppSnackbar from '../../actions/snackbar'
import constants from '../../constants/constants'
import Icons from '../../constants/Icons'
import urlConstants from '../../constants/urlConstants'
import { UserConsumer } from '../../context/UserContext'
import CustomButton from '../../layout/Button'
import helper from '../../shared/helper'
import httpHelper from '../../shared/httpHelper'
import PageHeader from '../PageHeader/PageHeader'
import AutoComplete from '../shared/AutoComplete/AutoComplete'
import ImageEditor from '../shared/ImageEditor'

const styles = (theme) => ({
  card: {
    minWidth: 275,
    borderRadius: '10px',
    boxShadow: '2px 6px 12px #7474744D',
    color: theme.palette.primary.text,
    '& .MuiCardContent-root:last-child': {
      paddingBottom: '16px'
    }
  },
  profileInfoContainer: {
    display: 'flex',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column-reverse'
    }
  },
  profileInfoOnEdit: {
    display: 'flex',
    zIndex: 0,
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column'
    }
  },
  profileInfoContainerPart1: {
    display: 'flex',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column'
    },
    flex: 10
  },
  profileInfoContainerPart2: {
    display: 'flex',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column'
    },
    flex: 1
  },
  profileInfoContainerOnEdit: {
    margin: '24px 0px'
  },
  profilePicBlock: {
    flex: 2,
    position: 'relative'
  },
  profileInfoBlock: {
    flex: 8,
    padding: '0 16px',
    color: theme.palette.primary.text
  },
  profileEditBlock: {
    flex: 1,
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'flex-start'
  },
  largeAvatar: {
    width: theme.spacing(14),
    height: theme.spacing(14)
  },
  profilePicContainer: {
    display: 'flex',
    alignItems: 'center',
    padding: '16px',
    justifyContent: 'center'
    // [theme.breakpoints.down('xs')]: {
    //   justifyContent: 'center',
    // }
  },
  iconBtnLight: {
    // margin: theme.spacing(1),
    backgroundColor: theme.palette.white.white2,
    color: theme.palette.grey.grey5,
    padding: '8px'
  },
  iconSizeSmall: {
    fontSize: 'small'
  },
  flexOne: {
    flex: 1
  },
  profileInfoTitle: {
    display: 'flex',
    fontWeight: 600,
    padding: '4px 0'
  },
  profileInfo: {
    display: 'flex',
    fontWeight: 350,
    padding: '4px 0',
    color: theme.palette.grey.grey5
  },
  changeImageBtnContainer: {
    display: 'flex',
    justifyContent: 'center'
  },
  textFieldFormat: {
    padding: '8px 16px',
    '& .MuiOutlinedInput-root': {
      borderRadius: '24px',
      '&:hover fieldset': {
        borderColor: theme.palette.primary.main
      }
    },
    '& .MuiOutlinedInput-input': {
      color: theme.palette.grey.grey5
    },
    '& .MuiOutlinedInput-notchedOutline': {
      // borderColor: theme.palette.secondary.text,
    }
  },
  textFieldTitle: {
    padding: '0px 14px',
    fontWeight: 600
  },
  textFieldSub: {
    padding: '0px 14px',
    opacity: 0.6
  },
  textFieldSubTitle: {
    fontWeight: 600
  },
  textDecoration: {
    textDecoration: 'underline'
  },
  textField: {
    width: '100%'
  },
  footerActions: {
    margin: '24px 0'
  },
  footerActionButtons: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  profileInstructions: {
    color: theme.palette.grey.grey5
  },
  displayFlex: {
    display: 'flex'
  },
  infoBlock: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1
  },
  profileNameHeader: {
    [theme.breakpoints.down('xs')]: {
      textAlign: 'center'
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
  dropDownMenu: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(0.5),
    display: 'flex',
    '& .MuiOutlinedInput-input': {
      fontSize: '16px',
      padding: '13px 14px'
    },
    '& .MuiSelect-selectMenu': {
      minHeight: 'auto'
    }
  },
  anonymize: {
    display: 'flex',
    justifyContent: 'flex-end',
    '& .MuiTypography-body1': {
      color: theme.palette.secondary.textButton,
      fontWeight: theme.palette.fontWeight.Dark,
      fontSize: '14px'
    }
  },
  switchContainer: {
    paddingBottom: '14px',
    marginBottom: '8px',
    '& .MuiInputAdornment-positionEnd': {
      paddingRight: '14px'
    },
    '& .MuiOutlinedInput-root': {
      borderRadius: '24px'
    },
    '& .MuiOutlinedInput-input': {
      paddingTop: '10.5px',
      paddingBottom: '10.5px'
    }
  },
  divError: {
    marginLeft: '14px',
    marginRight: '14px',
    marginTop: '3px'
  }
})

class MyProfile extends Component {
  static contextType = UserConsumer
  constructor (props) {
    super(props)
    this.state = {
      isEditMode: true,
      cropperOpen: false,
      data: {},
      readyToDisplay: false
    }
  }

  handleImageEditor = async (type, croppedImg) => {
    if (type === 'save' && croppedImg) {
      this.setState({
        ...this.state,
        cropperOpen: false,
        data: {
          ...this.state.data,
          profilePic: croppedImg
        }
      })
    } else {
      this.setState({
        ...this.state,
        cropperOpen: false
      })
    }
  }

  componentDidMount = async () => {
    // const { attributes: userData } = this.context;
    const { userData, teamInfo } = this.context
    console.log('My Profile data', userData)
    await this.setState({
      ...this.state,
      profileName: userData.firstName + ' ' + userData.lastName,
      userId: userData.createdAt,
      data: {
        ...this.state.data,
        firstName: userData.firstName,
        lastName: userData.lastName,
        location: userData.location,
        jobTitle: userData.jobTitle,
        department: userData.department,
        profilePic: userData.profilePic,
        age: userData.age,
        countryNationality: userData.countryNationality,
        gender: userData.gender,
        isAnonymous: userData.isAnonymous,
        sector: userData.sector,
        underRepresentedGroups: userData.underRepresentedGroups,
        organization: userData.organization
      },
      userName: userData.userName,
      waitingForAPI: false,
      showSnackBar: false,
      snackMessage: '',
      snackMessageType: 'error',
      readyToDisplay: true,
      teamData: teamInfo
    })
    this.resetData = { ...this.state.data }
  }

  onEditProfileInfo = () => {
    this.setState({
      ...this.state,
      isEditMode: true
    })
  }

  onChangeImage = async (event) => {
    const fileCopy = event.target.files[0]
    event.target.value = null
    if (fileCopy) {
      const validate = await helper.checkFileType(fileCopy, constants.IMAGE_KEYWORD)
      if (validate.result) {
        const reader = new FileReader()
        console.log('Reader', reader)
        reader.readAsDataURL(fileCopy)
        reader.onload = (event) => {
          // The file's text will be printed here
          // console.log("Event", event.target.result);
          this.setState({
            ...this.state,
            profilePicUpdated: true,
            cropperOpen: true,
            fileSelected: fileCopy,
            data: {
              ...this.state.data,
              profilePic: event.target.result
            }
          })
        }
      } else {
        this.showSnackBar(constants.ERROR_MESSAGE[validate.reason], constants.ERROR_MESSAGE.TYPE)
      }
    }
  }

  onImageSave = async () => {
    console.log('onImageSave')
    const file = this.state.data.profilePic
    let getPreSignedUrl

    if (file) {
      const fileExtension = file.split(';')[0].replace(/^data:image\//, '')
      const object = constants.USER_KEYWORD
      const thumbnailUrl = this.state.userId + '.' + fileExtension
      const fileType = file.split(';')[0].replace(/^data:/, '')
      const data = helper.dataURItoBlob(file)

      const params = [
        { param: '{object}', value: object },
        { param: '{thumbnailUrl}', value: thumbnailUrl },
        { param: '{fileType}', value: fileType }
      ]

      try {
        const queryStringParameters = {
          tId: helper.getDomain()
        }
        const address = helper.metaMaskAddress()
        if (address) {
          queryStringParameters.address = address
        }
        const { preSignedUrl } = await httpHelper.get(urlConstants.getPreSignedUrl, httpHelper.getUri(urlConstants.getPreSignedUrl, params), { queryStringParameters })
        getPreSignedUrl = preSignedUrl
        console.log('PreSignedUrl generated:', getPreSignedUrl)
        await helper.uploadImage(getPreSignedUrl, data, fileType)
        this.setState({
          ...this.state,
          profilePicCopy: getPreSignedUrl.split('?')[0],
          profilePicUpdated: false,
          data: {
            ...this.state.data,
            profilePic: getPreSignedUrl.split('?')[0] + '?' + Date.now()
          }
        })
      } catch (e) {
        await helper.handleUnauthorizedError(e)
        console.log('Error:', e)
      }
    }
  }

  handleInputChange = (event, name) => {
    if (name === 'isAnonymous') {
      this.setState({
        ...this.state,
        data: {
          ...this.state.data,
          [name]: !(this.state.data.isAnonymous || false)
        }
      })
    } else {
      this.setState({
        ...this.state,
        data: {
          ...this.state.data,
          [name]: event.target.value
        }
      })
    }
  }

  validationCheck = () => {
    if (this.state.teamData && this.state.teamData.customFeatures && this.state.teamData.customFeatures.userFields && this.state.teamData.customFeatures.userFields.sector) {
      return (
        this.state.data.firstName &&
        this.state.data.lastName &&
        this.state.data.age &&
        this.state.data.gender &&
        this.state.data.location &&
        this.state.data.sector &&
        this.state.data.firstName.trim() &&
        this.state.data.lastName.trim() &&
        this.state.data.age.trim() &&
        this.state.data.gender.trim() &&
        this.state.data.location.trim() &&
        this.state.data.sector.trim()
      )
    } else {
      return (
        this.state.data.firstName &&
        this.state.data.lastName &&
        this.state.data.age &&
        this.state.data.gender &&
        this.state.data.location &&
        this.state.data.firstName.trim() &&
        this.state.data.lastName.trim() &&
        this.state.data.age.trim() &&
        this.state.data.gender.trim() &&
        this.state.data.location.trim()
      )
    }
  }

  onSave = async () => {
    if (this.validationCheck()) {
      // this.state.data.countryNationality && this.state.data.underRepresentedGroups && this.state.data.organization && this.state.data.countryNationality.trim() && this.state.data.underRepresentedGroups.trim() && this.state.data.organization.trim() &&
      this.setState({
        ...this.state,
        waitingForAPI: true
      })
      if (this.state.profilePicUpdated) {
        await this.onImageSave()
      }
      const trimmedData = {}
      Object.keys(this.state.data).forEach((el) => {
        if (this.state.data && this.state.data[el] && this.state.data[el] !== true) {
          trimmedData[el] = this.state.data[el].trim()
        } else if (this.state.data) {
          trimmedData[el] = this.state.data[el]
        }
      })
      const params = [{ param: '{teamId}', value: helper.getDomain }]
      const postData = {
        body: {
          updateAttributes: {
            ...trimmedData
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
        console.log('UpdateUser response', res)
        this.context.updateUserdata(res)
        this.setState({
          ...this.state,
          profileName: trimmedData.firstName + ' ' + trimmedData.lastName,
          data: {
            ...trimmedData
          },
          isEditMode: false,
          waitingForAPI: false
        })
        this.showSnackBar(constants.SUCCESS_MESSAGE.UPDATE_MY_PROFILE, constants.SUCCESS_MESSAGE.TYPE)
        this.resetData = { ...this.state.data }
      } catch (e) {
        console.log('Error:', e)
        this.setState({
          ...this.state,
          waitingForAPI: false
        })
        this.showSnackBar(constants.ERROR_MESSAGE.UPDATE_MY_PROFILE, constants.ERROR_MESSAGE.TYPE)
      }
    } else {
      await this.setState({
        ...this.state,
        data: {
          ...this.state.data,
          firstName: this.state.data.firstName.trim(),
          lastName: this.state.data.lastName.trim()
        }
      })
      this.resetData = { ...this.state.data }
      this.showSnackBar(constants.ERROR_MESSAGE.UPDATE_MY_PROFILE, constants.ERROR_MESSAGE.TYPE)
    }
  }

  onCancel = () => {
    this.setState({
      ...this.state,
      profileName: this.resetData.firstName + ' ' + this.resetData.lastName,
      profilePicUpdated: false,
      data: {
        ...this.resetData
      },
      isEditMode: false
    })
  }

  handleAutoCompleteChange = (value, key) => {
    console.log('handleAutoCompleteChange', value)
    this.setState({
      ...this.state,
      data: {
        ...this.state.data,
        [key]: value
      }
    })
  }

  showSnackBar = (message, type) => {
    this.setState({
      showSnackBar: true,
      snackMessage: message,
      snackMessageType: type,
      waitingForAPI: false
    })
  }

  closeSnackbarVisibility = (event) => {
    this.setState({
      showSnackBar: false,
      snackMessage: ''
    })
  }

  render () {
    const { classes } = this.props
    this.cities = [
      'Vancouver',
      'Victoria',
      'Surrey',
      'Ottawa',
      'Abbotsford',
      'Prince George',
      'Hamilton',
      'Penticton',
      'Halifax',
      'Toronto',
      'Quebec City',
      'London',
      'Leeds',
      'Sheffield',
      'Swansea',
      'York',
      'Manchester',
      'New York',
      'Chicago',
      'San Francisco',
      'Washington, D.C.',
      'Los Angeles',
      'Houston',
      'Philadelphia',
      'Boston',
      'Seattle',
      'Detroit',
      'Dubai',
      'Cairo',
      'Abu Dhabi',
      'Baghdad',
      'Mecca',
      'Istanbul',
      'Tehran',
      'Kuwait City',
      'Sharjah',
      'Doha',
      'Mumbai',
      'Chennai',
      'Bengaluru',
      'Kolkata',
      'Ahmedabad',
      'Hyderabad',
      'Jaipur',
      'New Delhi',
      'Pune',
      'Surat',
      'Lucknow',
      'Chandigarh',
      'Bhopal',
      'Indore',
      'Agra',
      'Kochi'
    ]
    this.countryNationality = constants.COUNTRY_NATIONALITY
    // this.hierarchy = ["Senior Management", "Manager", "User", "Senior Admin"];
    return (
      <div>
        {this.state.readyToDisplay && (
          <StickyContainer>
            <PageHeader
              headerIcon={<Icons.ACCOUNT_BOX_ICON />}
              // headerTitle={<FormattedMessage id="myProfileTitle" />}
              headerTitle={<Translate>My Profile</Translate>}
              isCreateChallengeProcess={true}
            />
            <Container>
              {!this.state.isEditMode
                ? (<Card className={classes.card}>
                  <CardContent>
                    <div className={classes.profileInfoContainer}>
                      <div className={classes.profileInfoContainerPart1}>
                        <div className={classes.profilePicBlock}>
                          <div className={classes.profilePicContainer}>
                            <Avatar src={this.state.data.profilePic} className={classes.largeAvatar} />
                          </div>
                        </div>

                        <div className={classes.profileInfoBlock}>
                          <h1 className={classes.profileNameHeader}>{this.state.profileName ? <Translate>{this.state.profileName}</Translate> : this.state.profileName}</h1>
                          <div>
                            <Grid container spacing={3}>
                              <Grid item xs={12} sm={12} md={6}>
                                <div className={classes.displayFlex}>
                                  <div className={classes.infoBlock}>
                                    <div className={classes.profileInfoTitle}>
                                      <Translate>Location</Translate>
                                    </div>
                                    <div className={classes.profileInfo}>
                                      <Translate>{this.state.data.location ? this.state.data.location : '-'}</Translate>
                                    </div>
                                  </div>
                                  <div className={classes.infoBlock}>
                                    <div className={classes.profileInfoTitle}>
                                      <Translate>Job Title</Translate>
                                    </div>
                                    <div className={classes.profileInfo}>
                                      <Translate>{this.state.data.jobTitle ? this.state.data.jobTitle : '-'}</Translate>
                                    </div>
                                  </div>
                                </div>
                              </Grid>

                              <Grid item xs={12} sm={12} md={6}>
                                <div className={classes.displayFlex}>
                                  <div className={classes.infoBlock}>
                                    <div className={classes.profileInfoTitle}>
                                      <Translate>Department</Translate>
                                    </div>
                                    <div className={classes.profileInfo}>
                                      <Translate>{this.state.data.department ? this.state.data.department : '-'}</Translate>
                                    </div>
                                  </div>
                                  {/* <div className={classes.infoBlock}>
                                  <div className={classes.profileInfoTitle}>Hierarchy</div>
                                  <div className={classes.profileInfo}>{this.state.data.hierarchy ? this.state.data.hierarchy : "Senior Management"}</div>
                                </div> */}
                                </div>
                              </Grid>
                            </Grid>
                          </div>
                        </div>
                      </div>

                      <div className={classes.profileInfoContainerPart2}>
                        <div className={classes.profileEditBlock}>
                          <IconButton className={classes.iconBtnLight} onClick={this.onEditProfileInfo}>
                            <Icons.BORDER_COLOR_ICON className={classes.iconSizeSmall} />
                          </IconButton>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>)
                : (
                <div>
                  <div className={classes.profileInfoContainerOnEdit}>
                    <div className={classes.profileInfoOnEdit}>
                      <div className={classes.profilePicBlock}>
                        <div className={classes.profilePicContainer}>
                          <Avatar src={this.state.data.profilePic} className={classes.largeAvatar} />
                        </div>
                        <div className={classes.changeImageBtnContainer}>
                          <CustomButton variant="upload-button" onUploadChange={(e) => this.onChangeImage(e)}>
                            <span>
                              <Translate>Change Image</Translate>
                            </span>
                            &nbsp;
                            <Icons.CLOUD_UPLOAD_ICON />
                          </CustomButton>
                        </div>
                        {this.state.cropperOpen && <ImageEditor profilePic={this.state.data.profilePic} handleImageEditor={this.handleImageEditor} width={260} height={260} />}
                      </div>
                      <div className={classes.profileInfoBlock}>
                        {this.state.profileName && (
                          <h1 className={classes.profileNameHeader}>
                            <Translate>{this.state.profileName}</Translate>
                          </h1>
                        )}
                        {/* <div className={classes.profileInstructions}>
                        Your personal and company details help to evaluate the diversity and
                        inclusivity of proposals, teams and the overall company. Your privacy is
                        respected at all times, and in most cases your personal details are anonymised.
                      </div> */}
                      </div>
                    </div>
                  </div>

                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <PersonalDetails classes={classes} that={this} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <RoleDetails classes={classes} that={this} />
                    </Grid>
                    {/* <Grid item xs={12} sm={6}>
                    <MyPrivacy
                        classes={classes}
                        that={this}
                      />
                  </Grid> */}
                  </Grid>

                  <div className={classes.footerActions}>
                    <Card className={classes.card}>
                      <CardContent>
                        <div className={classes.footerActionButtons}>
                          <CustomButton variant="secondary" disabled={this.state.waitingForAPI} onClick={this.onCancel}>
                            <Translate>Cancel</Translate>
                          </CustomButton>
                          <CustomButton variant="primary" disabled={this.state.waitingForAPI || this.state.cropperOpen} onClick={this.onSave}>
                            <Translate>Save</Translate>
                            <Icons.ARROW_RIGHT_ICON />
                          </CustomButton>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>)}
            </Container>
          </StickyContainer>
        )}
        {this.state.showSnackBar && this.state.snackMessageType && (
          <AppSnackbar
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center'
            }}
            snackbarType={this.state.snackMessageType}
            showSnackbar={this.state.showSnackBar}
            message={this.state.snackMessage}
            handleClose={this.closeSnackbarVisibility}
          />
        )}
      </div>
    )
  }
}

MyProfile.propTypes = {
  classes: PropTypes.any
}

const PersonalDetails = (props) => {
  const { that } = props
  return (
    <Card className={props.classes.card}>
      <CardContent>
        <h3>
          <Translate>My Personal Details</Translate>
        </h3>
        <TextFieldFormat
          classes={props.classes}
          title={<Translate>First Name</Translate>}
          value={that.state.data.firstName}
          that={that}
          name="firstName"
          mandatory={true}
          errorStatus={that.state.data.firstName}
        />
        <TextFieldFormat
          classes={props.classes}
          title={<Translate>Last Name</Translate>}
          value={that.state.data.lastName}
          that={that}
          name="lastName"
          mandatory={true}
          errorStatus={that.state.data.lastName}
        />
        <DropDownMenuFormat
          classes={props.classes}
          // title={<FormattedMessage id="ageTitle" />}
          title={<Translate>Age*</Translate>}
          options={constants.AGE_INTERVAL_SCALE}
          type="age"
          selectedOption={that.state.data.age}
          handleInputChange={that.handleInputChange}
          name="age"
          errorStatus={!that.state.data.age}
          errorMessage="Select age."
        />
        <DropDownMenuFormat
          classes={props.classes}
          // title={<FormattedMessage id="genderTitle" />}
          title={<Translate>Gender*</Translate>}
          options={constants.GENDER}
          type="gender"
          selectedOption={that.state.data.gender}
          handleInputChange={that.handleInputChange}
          name="gender"
          errorStatus={!that.state.data.gender}
          errorMessage="Select gender."
        />
        {/* <AutoCompleteFormat
          classes={props.classes}
          // title={<FormattedMessage id="countryNationalityTitle" />}
          title={<Translate>Nationality*</Translate>}
          value={that.state.data["countryNationality"]}
          that={that}
          options={that.countryNationality}
          name="countryNationality"
          errorStatus={!that.state.data["countryNationality"]}
          errorMessage="Select nationality."
        /> */}
        {that.state.teamData && that.state.teamData.customFeatures && that.state.teamData.customFeatures.userFields && that.state.teamData.customFeatures.userFields.underRepresentedGroups && (
          <DropDownMenuFormat
            classes={props.classes}
            // title={<FormattedMessage id="underRepresentedGroupsTitle" />}
            title={<Translate>Would you like to state which, if any, group you most identify with?</Translate>}
            options={constants.UNDER_REPRESENTED_GROUPS}
            type="underRepresentedGroups"
            selectedOption={that.state.data.underRepresentedGroups}
            handleInputChange={that.handleInputChange}
            name="underRepresentedGroups"
            errorStatus={false} //! that.state.data["underRepresentedGroups"]
            errorMessage="Select under-represented groups."
          />
        )}
      </CardContent>
    </Card>
  )
}

PersonalDetails.propTypes = {
  classes: PropTypes.any,
  that: PropTypes.any
}

const RoleDetails = (props) => {
  const { that } = props
  return (
    <Card className={props.classes.card}>
      <CardContent>
        <h3>
          <Translate>My Role</Translate>
        </h3>
        <TextFieldFormat
          classes={props.classes}
          title={<Translate>Organization</Translate>}
          // title={<FormattedMessage id="organizationTitle" />}
          value={that.state.data.organization}
          that={that}
          name="organization"
          mandatory={false}
          errorStatus={!that.state.data.organization}
        />
        <AutoCompleteFormat
          classes={props.classes}
          // title={<FormattedMessage id="locationTitle" />}
          title={<Translate>Location*</Translate>}
          value={that.state.data.location}
          that={that}
          options={that.countryNationality}
          name="location"
          errorStatus={!that.state.data.location}
          errorMessage="Select location."
        />
        {that.state.teamData && that.state.teamData.customFeatures && that.state.teamData.customFeatures.userFields && that.state.teamData.customFeatures.userFields.sector && (
          <DropDownMenuFormat
            classes={props.classes}
            // title={<FormattedMessage id="sectorTitle" />}
            title={<Translate>Primary Sector*</Translate>}
            options={constants.SECTOR}
            type="sector"
            selectedOption={that.state.data.sector}
            handleInputChange={that.handleInputChange}
            name="sector"
            errorStatus={!that.state.data.sector}
            errorMessage="Select sector."
          />
        )}
        <TextFieldFormat classes={props.classes} title={<Translate>Job Title</Translate>} value={that.state.data.jobTitle} that={that} name="jobTitle" mandatory={false} />
        {/* <AutoCompleteFormat
          classes={props.classes}
          title="Hierarchy"
          value={that.state.data["hierarchy"]}
          that={that}
          options={that.hierarchy}
          name="hierarchy"
        /> */}
        <TextFieldFormat classes={props.classes} title={<Translate>Department</Translate>} value={that.state.data.department} that={that} name="department" mandatory={false} />
      </CardContent>
    </Card>
  )
}

RoleDetails.propTypes = {
  classes: PropTypes.any,
  that: PropTypes.any
}

// const MyPrivacy = (props) => {
//   const { that } = props
//   return (
//     <Card className={props.classes.card}>
//       <CardContent>
//         <h3>
//           <Translate>My Privacy</Translate>
//         </h3>
//         <div className={props.classes.textFieldFormat}>
//           <div className={props.classes.textFieldTitle}>
//             <Translate>Anonymise my participation</Translate>
//           </div>
//           <SwitchFormat
//             classes={props.classes}
//             title="I wish to remain anonymous*"
//             type="isAnonymous"
//             checked={that.state.data.isAnonymous}
//             handleInputChange={that.handleInputChange}
//             name="isAnonymous"
//           />
//           <div className={props.classes.textFieldSub}>
//             <span className={props.classes.textFieldSubTitle}>
//               <Translate>Our commitment to your privacy:</Translate>
//             </span>
//             <Translate>Anonymised data will be recorded for analytics purposesnonly, but your personal details will not be revealed, even to UN Management personnel (unless you breach the </Translate>
//             <span className={props.classes.textDecoration}>
//               <Translate>Terms of Use</Translate>
//             </span>
//             )
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   )
// }
// const SwitchFormat = (props) => {
//   const [title, setTitle] = useState(props.title)
//   const lang = useContext(LangContext)
//   const [currentLang, setCurrentLang] = useState()
//   const getTranslator = async (title) => {
//     const data = await helper.translator('text/plain', lang.lang, 'en', title)
//     setTitle(data && data.translations ? data.translations : props.title)
//   }
//   if (currentLang !== lang.lang) {
//     if (lang && lang.lang === 'en') {
//       setCurrentLang(lang.lang)
//       setTitle(props.title)
//     } else {
//       setCurrentLang(lang.lang)
//       getTranslator(props.title)
//     }
//   }
//   return (
//     <div className={props.classes.switchContainer}>
//       {/* <FormattedMessage id={props.id}>
//         {title => */}
//       <TextField
//         id="outlined-start-adornment"
//         margin="normal"
//         value={title}
//         className={props.classes.textField}
//         InputProps={{
//           endAdornment: (
//             <InputAdornment position="end">
//               <Switch
//                 type="IOSSwitch"
//                 // label=""
//                 labelPlacement="start"
//                 switchValue="start"
//                 checked={props.checked}
//                 switchHandleChange={(event) => props.handleInputChange(event, props.type)}
//               />
//             </InputAdornment>
//           )
//         }}
//         disabled={true}
//         variant="outlined"
//       />
//       {/* //     }
//       // </FormattedMessage> */}
//     </div>
//   )
// }

const TextFieldFormat = (props) => {
  const { that, name, mandatory, errorStatus } = props
  return (
    <div className={props.classes.textFieldFormat}>
      <div className={props.classes.textFieldTitle}>{props.title}</div>
      <div>
        <TextField
          className={props.classes.textField}
          margin="dense"
          value={props.value}
          id="outlined-basic"
          variant="outlined"
          onChange={(e) => that.handleInputChange(e, name)}
          error={mandatory ? !errorStatus : false}
          helperText={mandatory && !errorStatus ? 'Please fill the field' : null}
          onBlur={that.onTextFieldBlur}
        />
      </div>
    </div>
  )
}

TextFieldFormat.propTypes = {
  classes: PropTypes.any,
  that: PropTypes.any,
  name: PropTypes.any,
  mandatory: PropTypes.any,
  errorStatus: PropTypes.any,
  title: PropTypes.any,
  value: PropTypes.any
}

const DropDownMenuFormat = (props) => {
  return (
    <div className={props.classes.textFieldFormat}>
      <div className={props.classes.textFieldTitle}>{props.title}</div>
      <div className={`${props.classes.textField} ${props.classes.dropDownMenu}`}>
        <DropDownMenu options={props.options} isDisabled={false} selectedOption={props.selectedOption} type={props.type} handleChange={(type, event, child) => props.handleInputChange(event, type)} />
      </div>
      <div className={`${props.classes.divError} ${!props.errorStatus ? props.classes.errorMinHeight : ''}`}>
        {props.errorStatus && (
          <FormControlLabel
            control={<Icons.ERROR_ICON className={props.classes.error} />}
            label={
              <span className={props.classes.errorMessage}>
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
  classes: PropTypes.any,
  title: PropTypes.any,
  options: PropTypes.any,
  selectedOption: PropTypes.any,
  errorStatus: PropTypes.any,
  errorMessage: PropTypes.any,
  handleInputChange: PropTypes.any,
  type: PropTypes.any
}

const AutoCompleteFormat = (props) => {
  const { that, name } = props
  return (
    <div className={props.classes.textFieldFormat}>
      <div className={props.classes.textFieldTitle}>{props.title}</div>
      <div>
        <AutoComplete options={props.options} value={props.value} className={props.classes.textField} onChangeCallback={(e) => that.handleAutoCompleteChange(e, name)} />
      </div>
      <div className={`${props.classes.divError} ${!props.errorStatus ? props.classes.errorMinHeight : ''}`}>
        {props.errorStatus && (
          <FormControlLabel
            control={<Icons.ERROR_ICON className={props.classes.error} />}
            label={
              <span className={props.classes.errorMessage}>
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
  classes: PropTypes.any,
  that: PropTypes.any,
  name: PropTypes.any,
  title: PropTypes.any,
  options: PropTypes.any,
  errorMessage: PropTypes.any,
  errorStatus: PropTypes.any,
  value: PropTypes.any
}

export default withStyles(styles)(MyProfile)
