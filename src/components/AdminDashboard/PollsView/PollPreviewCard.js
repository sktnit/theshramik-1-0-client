import React, { useState, useContext, memo } from 'react'
import PropTypes from 'prop-types'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import IconButton from '@mui/material/IconButton'
import makeStyles from '@material-ui/core/styles/makeStyles'
import Avatar from '@mui/material/Avatar'
import { Translate } from 'react-auto-translate'
import ListAvatarGroup from './ListAvatarGroup'
import { UserConsumer } from '../../../context/UserContext'
import Divider from '@material-ui/core/Divider'
import DateLinearProgress from './DateLinearProgress'
import CardMedia from '@mui/material/CardMedia'
import constants from '../../../constants/constants'
import Icons from '../../../constants/Icons'
import { StartFlagIcon } from '../../../constants/svg/StartFlagIcon'
import { EndFlagIcon } from '../../../constants/svg/EndFlagIcon'
import * as moment from 'moment'
import { useHistory } from 'react-router-dom'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import helper from '../../../shared/helper'
import Loading from '../../../layout/Loading'
import cloneDeep from 'lodash/cloneDeep'
import loadable from '@loadable/component'
import httpHelper from '../../../shared/httpHelper'
import urlConstants from '../../../constants/urlConstants'
import AppSnackbar from '../../../actions/snackbar'
import TeamContext from '../../../context/TeamContext'
const NoItem = loadable(() => import('../../../layout/NoItem'))
const PollOptions = loadable(() => import('./PollOptions'))

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTypography-root': {
      color: theme.palette.primary.text
    },
    '& .MuiCardHeader-title': {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      display: '-webkit-box',
      wordBreak: 'break-word',
      '-webkit-line-clamp': 3,
      '-webkit-box-orient': 'vertical'
    },
    '& .MuiCardHeader-subheader': {
      color: theme.palette.primary.text,
      paddingTop: '8px',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      display: '-webkit-box',
      wordBreak: 'break-word',
      '-webkit-line-clamp': 2,
      '-webkit-box-orient': 'vertical'
    },
    '& .MuiCardHeader-root': {
      alignItems: 'flex-start'
    },
    '& .MuiAvatarGroup-root .MuiAvatar-root': {
      width: '32px',
      height: '32px',
      fontSize: '16px',
      marginLeft: '-6px',
      fontWeight: 500
    },
    '& .MuiLinearProgress-root': {
      height: '8px'
    },
    '& .MuiCardContent-root': {
      padding: '0px 16px'
    }
    // '& .MuiButtonBase-root.MuiIconButton-root': {
    //   background: 'none'
    // }
  },
  largeRoot: {
    '& .MuiAvatarGroup-root .MuiAvatar-root': {
      width: '48px',
      height: '48px'
    }
  },
  votesInfoContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  cardActions: {
    padding: '12px 8px !important',
    borderTop: '1px solid #CCCCCC',
    justifyContent: 'space-between',
    marginTop: '10px',
    color: theme.palette.primary.text
  },
  bottomCenterText: {
    position: 'absolute',
    bottom: '0',
    color: '#ffffff',
    paddingLeft: '60px'
  },
  creditBGStyle: {
    height: '16%',
    bottom: '0',
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.4);',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  linkText: {
    color: '#ffffff',
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
      cursor: 'pointer'
    }
  },
  textCapitalize: {
    textTransform: 'lowercase',
    wordBreak: 'break-all',
    maxWidth: 90,
    display: '-webkit-box',
    overflow: 'hidden',
    '-webkit-line-clamp': '1 !important',
    '-webkit-box-orient': 'vertical'
  },
  media: {
    height: '240px',
    width: '100%',
    position: 'relative'
  },
  videoMedia: {
    position: 'absolute',
    objectFit: 'cover'
  },
  cardHeaderAction: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
    // margin: '-16px'
  },
  cardHeaderActionPreview: {
    margin: '16px'
  },
  cardHeaderAvatar: {
    display: 'flex',
    height: '64px',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  largeCardHeaderAvatar: {
    height: '96px'
  },
  cardActionArea: {
    cursor: (props) => props.isNonLoggedInView || props.createPollPreview ? 'auto' : 'pointer'
  },
  menu: {
    '& .MuiMenuItem-root': {
      color: theme.palette.primary.text
    }
  },
  avatarBorderSolid: {
    border: `solid 2px ${theme.palette.primary.main}`
  },
  nonLoggedCardAlgin: {
    '& .MuiCard-root': {
      backgroundColor: 'transparent'
    }
  },
  muiAvatarRoot: {
    '& .MuiAvatar-root': {
      width: '40px',
      height: '40px'
    }
  },
  largeMuiAvatarRoot: {
    '& .MuiAvatar-root': {
      width: '60px',
      height: '60px'
    }
  }
  // linearProgressContainer: {
  //   cursor: 'pointer'
  // }
}))

function PollPreviewCard (props) {
  const classes = useStyles(props)
  const history = useHistory()
  const teamData = useContext(TeamContext)
  const context = useContext(UserConsumer)
  const email = context && context.attributes && context.attributes.email
  const [addedOptionsArray, setAddedOptionsArray] = useState([])
  const [showSnackBar, setShowSnackBar] = useState(false)
  const [waitingForAddOptionAPI, setWaitingForAddOptionAPI] = useState(false)
  const [snackMessage, setSnackMessage] = useState('')
  const [snackMessageType, setSnackMessageType] = useState('error')
  const { poll, submitPollVoteCallback, waitingForAPI, voteInfo, voterList, handleBookmark, liveVoteStatus, waitingForSubmitVoteAPI } = props
  const isVoted = !!(voteInfo && Object.keys(voteInfo) && Object.keys(voteInfo).length)
  const isVideo = poll && poll.thumbnailUrl && typeof poll.thumbnailUrl !== 'object' ? poll.thumbnailUrl.includes('pollVideo') : false
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  const closeSnackbarVisibility = () => {
    setShowSnackBar(false)
    setSnackMessage('')
  }

  const showSnackBarFunc = (message, type) => {
    setShowSnackBar(true)
    setSnackMessage(message)
    setSnackMessageType(type)
  }

  const handleAddOptionByOthers = () => {
    const optionsCopy = cloneDeep(poll.options)
    const id = helper.getUUID()
    const optionObj = {
      id,
      option: '',
      createdBy: email,
      createdAt: Date.now()
    }
    const addedOptionsArrayCopy = cloneDeep(addedOptionsArray)
    addedOptionsArrayCopy.push(id)
    setAddedOptionsArray(addedOptionsArrayCopy)
    optionsCopy.push(optionObj)
    props.updatePollOptions(optionsCopy)
  }

  const removeOption = (index, id) => {
    const optionsCopy = cloneDeep(poll.options)
    if (index !== -1) {
      optionsCopy.splice(index, 1)
    }
    const addedOptionsArrayCopy = cloneDeep(addedOptionsArray)
    const newOptionIndex = addedOptionsArrayCopy.indexOf(id)
    if (newOptionIndex !== -1) {
      addedOptionsArrayCopy.splice(newOptionIndex, 1)
    }
    setAddedOptionsArray(addedOptionsArrayCopy)
    props.updatePollOptions(optionsCopy)
  }

  const onSaveAddedOptions = async () => {
    let newOptions = []
    try {
      if (poll.options && poll.options.length) {
        let isEmptyOption
        poll.options.forEach(el => {
          if (!((el.option && el.option !== '') || (el.icon && el.icon !== ''))) {
            isEmptyOption = true
          }
        })
        if (isEmptyOption) {
          showSnackBarFunc(constants.ERROR_MESSAGE.FILL_THE_EMPTY_OPTION, constants.ERROR_MESSAGE.TYPE)
          return
        }
        newOptions = poll.options.filter(el => addedOptionsArray.includes(el.id))
      }
      setWaitingForAddOptionAPI(true)
      const params = [{ param: '{actionName}', value: 'updatePoll' }]
      const postData = {
        body: {
          teamId: helper.getDomain(),
          pollId: poll.pollId,
          newOptions,
          nonLoggedInUserId: helper.getUUID(),
          action: constants.ACTION.UPDATE
        }
      }
      const address = helper.metaMaskAddress()
      if (address) {
        postData.body.address = address
      }
      const res = await httpHelper.post(urlConstants.action, httpHelper.getUri(urlConstants.action, params), postData)
      setAddedOptionsArray([])
      props.updatePollInfo(res.Attributes)
      setWaitingForAddOptionAPI(false)
      showSnackBarFunc(constants.SUCCESS_MESSAGE.ADD_NEW_POLL_OPTION, constants.SUCCESS_MESSAGE.TYPE)
    } catch (error) {
      setWaitingForAddOptionAPI(false)
      showSnackBarFunc(constants.ERROR_MESSAGE.ADD_NEW_POLL_OPTION, constants.ERROR_MESSAGE.TYPE)
    }
  }

  const handleCardClick = () => {
    if (!props.isNonLoggedInView && !props.createPollPreview) {
      history.push({
        pathname: `/poll-info/${poll.pollId}`
      })
    }
  }

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleBookmarkFunc = () => {
    handleClose()
    handleBookmark(poll.pollId, poll.bookmarks)
  }

  const handleCopyLinkToClipboard = () => {
    const hostName = helper.getHostName()
    navigator.clipboard.writeText(`${hostName}/poll/${poll.pollId}`)
    handleClose()
  }

  return (
    <div className={`${classes.root} ${props.isNonLoggedInView ? classes.nonLoggedCardAlgin + ' ' + classes.largeRoot : ''}`}>
      {/* {!props.preview */}
        {(!waitingForAPI || liveVoteStatus || waitingForSubmitVoteAPI
          ? (poll && Object.keys(poll) && Object.keys(poll).length
              ? <Card sx={{ minWidth: 275, boxShadow: '0px 2px 6px #00000026', borderRadius: '8px', margin: '16px' }}>
                <div className={classes.cardActionArea} onClick={handleCardClick}>
                  {poll.thumbnailUrl && <CardMedia
                    className={classes.media}
                    image={poll.thumbnailUrl}
                  >
                    {isVideo && <video id="preview" className={`${classes.media} ${classes.videoMedia}`} src={poll.thumbnailUrl} controls />}

                    {/* For Unsplash Image */}
                    {poll && poll.uploadFrom && poll.uploadFrom === constants.IMAGE_TYPE.UNSPLASH && (
                      <div className={`${classes.bottomCenterText} ${classes.creditBGStyle}`}>
                        {poll.unsplashImageCredit && typeof poll.unsplashImageCredit === 'string'
                          ? (
                            <>
                              Photo by&nbsp;
                              <a
                                href={`${process.env.REACT_APP_UNSPLASH_ENDPOINT}/@${poll.unsplashImageUserName ? poll.unsplashImageUserName : ''}?utm_source=swae&utm_medium=referral`}
                                target="_blank"
                                className={classes.linkText}
                                onClick={(e) => e.stopPropagation()}
                                rel="noreferrer">
                                <span className={classes.textCapitalize}>{poll.unsplashImageCredit}</span>
                              </a>
                              &nbsp;on&nbsp;
                              <a
                                href={`${process.env.REACT_APP_UNSPLASH_ENDPOINT}/?utm_source=swae&utm_medium=referral`}
                                target="_blank"
                                className={classes.linkText}
                                onClick={(e) => e.stopPropagation()}
                                rel="noreferrer">
                                Unsplash
                              </a>
                            </>
                            )
                          : (
                            <>
                              Photo on&nbsp;
                              <a
                                href={`${process.env.REACT_APP_UNSPLASH_ENDPOINT}/?utm_source=swae&utm_medium=referral`}
                                target="_blank"
                                className={classes.linkText}
                                onClick={(e) => e.stopPropagation()}
                                rel="noreferrer">
                                Unsplash
                              </a>
                            </>
                            )}
                      </div>
                    )}
                  </CardMedia>}
                  <CardHeader
                    avatar={
                      <div className={`${classes.cardHeaderAvatar} ${props.isNonLoggedInView ? classes.largeCardHeaderAvatar + ' ' + classes.largeMuiAvatarRoot : classes.muiAvatarRoot}`}>
                        <Avatar alt={poll.createdByName} src={poll.isAnonymous ? teamData && teamData.anonymousIconUrls && teamData.anonymousIconUrls.anonymous ? teamData.anonymousIconUrls.anonymous : '' : props.creatorImage || poll.creatorImage} aria-label="poll-avatar" className={poll.isAnonymous ? classes.avatarBorderSolid : ''} />
                        {((poll.endTime > moment().unix() * 1000) || poll.continuous) || props.preview ? <StartFlagIcon width={props.isNonLoggedInView ? '19.0815' : '12.721'} height={props.isNonLoggedInView ? '19.5' : '13'} /> : <EndFlagIcon width={props.isNonLoggedInView ? '19.5' : '13'} height={props.isNonLoggedInView ? '19.5' : '13'} />}
                      </div>
                    }
                    action={
                      props.preview
                        ? <div className={classes.cardHeaderActionPreview}>
                        {poll.public ? <Icons.LOCK_OPEN_TWO_TONE_ICON color='primary' /> : <Icons.LOCK_TWO_TONE_ICON color='primary' />}
                      </div>
                        : <div>
                        {!props.isNonLoggedInView &&
                          <div onClick={(e) => e.stopPropagation()} className={classes.cardHeaderAction}>
                            {/* <IconButton onClick={() => handleBookmark(poll.pollId, poll.bookmarks)} aria-label="bookMark" title="Bookmark" disabled={waitingForAPI} >
                          <SvgIcon.Following
                            // color={usersContext && usersContext.bookMarkList && usersContext.bookMarkList.includes(props.proposalData.documentId) ? Theme.palette.blue.blue7 : Theme.palette.grey.grey7}
                            color={poll && poll.bookmarks && poll.bookmarks.includes(email) ? Theme.palette.blue.blue7 : Theme.palette.grey.grey7}
                            starcolor={Theme.palette.blue.blue6}
                            width="48"
                            height="48"
                          />
                        </IconButton> */}
                            <IconButton onClick={handleClick} aria-label="poll-menu">
                              <Icons.MORE_HORIZ_ICON />
                            </IconButton>
                            <Menu
                              id="demo-positioned-menu"
                              aria-labelledby="demo-positioned-button"
                              anchorEl={anchorEl}
                              open={open}
                              onClose={handleClose}
                              anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'left'
                              }}
                              transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left'
                              }}
                              className={`${classes.menu} ${props.isNonLoggedInView ? 'input-base-input-font-family-normal-22' : 'input-base-input-font-family-normal-15'}`}
                            >
                              <MenuItem className={props.isNonLoggedInView ? 'font-family-normal-22' : 'font-family-normal-15'} onClick={handleBookmarkFunc}>{poll && poll.bookmarks && poll.bookmarks.includes(email) ? 'Remove Bookmark' : 'Bookmark'}</MenuItem>
                              <MenuItem className={props.isNonLoggedInView ? 'font-family-normal-22' : 'font-family-normal-15'} onClick={handleCopyLinkToClipboard}>Copy shareable Poll link</MenuItem>
                            </Menu>
                            {poll.public ? <Icons.LOCK_OPEN_TWO_TONE_ICON color='primary' /> : <Icons.LOCK_TWO_TONE_ICON color='primary' />}
                          </div>}
                      </div>
                    }
                    title={<span className={props.isNonLoggedInView ? 'font-family-semi-bold-30' : 'font-family-semi-bold-20'}>{poll.title}</span>}
                    subheader={<span className={props.isNonLoggedInView ? 'font-family-normal-21' : 'font-family-normal-14'}>{poll.description}</span>}
                  />
                  {props.preview
                    ? <CardContent>
                      <PollOptions isNonLoggedInView={props.isNonLoggedInView} waitingForAPI={waitingForAPI || waitingForAddOptionAPI} preview={true} options={poll.options} state={poll.state} poll={poll} voted={isVoted} voteInfo={voteInfo} submitPollVoteCallback={(selectedOption) => submitPollVoteCallback(poll.pollId, selectedOption)} handleAddOptionByOthers={handleAddOptionByOthers} removeOption={removeOption} handleOptionsText={props.handleOptionsText} onSaveAddedOptions={onSaveAddedOptions} addedOptionsArray={addedOptionsArray} allowToAddOptions={true} />
                    </CardContent>
                    : <CardContent onClick={!isVoted && ((poll.endTime > moment().unix() * 1000) || poll.continuous) ? (e) => e.stopPropagation() : null}>
                    <div className={classes.votesInfoContainer}>
                      <div className={props.isNonLoggedInView ? 'font-family-normal-22' : 'font-family-normal-15'}>{poll.totalVotes || 0} votes</div>
                      <ListAvatarGroup list={voterList} />
                    </div>
                    <PollOptions isNonLoggedInView={props.isNonLoggedInView} waitingForAPI={waitingForAPI || waitingForAddOptionAPI} pollId={poll.pollId} options={poll.options} state={poll.state} poll={poll} voted={isVoted} voteInfo={voteInfo} submitPollVoteCallback={(selectedOption) => submitPollVoteCallback(poll.pollId, selectedOption)} handleAddOptionByOthers={handleAddOptionByOthers} removeOption={removeOption} handleOptionsText={props.handleOptionsText} onSaveAddedOptions={onSaveAddedOptions} addedOptionsArray={addedOptionsArray} allowToAddOptions={true} />
                  </CardContent>}
                </div>
                <Divider />
                <DateLinearProgress isNonLoggedInView={props.isNonLoggedInView} continuous={poll.continuous} endTime={poll.endTime} startTime={poll.startTime} />
              </Card>
              : <NoItem message={<Translate>Poll not found!</Translate>} />)
          : <Loading />)}
        {snackMessage && showSnackBar && (
          <AppSnackbar
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center'
            }}
            snackbarType={snackMessageType}
            showSnackbar={showSnackBar}
            message={snackMessage}
            handleClose={closeSnackbarVisibility}
          />)}
    </div>
  )
}

PollPreviewCard.propTypes = {
  poll: PropTypes.object,
  submitPollVoteCallback: PropTypes.func,
  waitingForAPI: PropTypes.bool,
  liveVoteStatus: PropTypes.bool,
  handleOptionsText: PropTypes.string,
  creatorImage: PropTypes.string,
  createPollPreview: PropTypes.any,
  waitingForSubmitVoteAPI: PropTypes.bool,
  preview: PropTypes.bool,
  voteInfo: PropTypes.object,
  voterList: PropTypes.array,
  handleBookmark: PropTypes.func,
  color: PropTypes.string,
  updatePollOptions: PropTypes.func,
  updatePollInfo: PropTypes.func,
  isNonLoggedInView: PropTypes.bool
}

export default memo(PollPreviewCard)
