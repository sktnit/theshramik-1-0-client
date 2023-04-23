import React, { memo, useContext, useEffect, useState, useRef } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import ControlledAccordion from '../ControlledAccordion'
import CommentView from '../Comment/CommentView'
import PollView from './PollView'
import Icons from '../../../constants/Icons'
import TeamContext from '../../../context/TeamContext'
import Container from '@material-ui/core/Container'
import Loading from '../../../layout/Loading'
import httpHelper from '../../../shared/httpHelper'
import urlConstants from '../../../constants/urlConstants'
import helper from '../../../shared/helper'
import constants from '../../../constants/constants'
import AppSnackbar from '../../../actions/snackbar'
import { pollVoteCalculatePercentage } from '../../../shared/utils'
import cloneDeep from 'lodash/cloneDeep'
import { UserConsumer } from '../../../context/UserContext'
import TextFieldDialog from '../../shared/TextFieldDialog'
import { FormattedMessage } from 'react-intl'

const useStyles = makeStyles((theme) => ({
  pollInfoRoot: {
    width: '100%'
  }
}))

function PollInfo (props) {
  const classes = useStyles()
  const userContext = useContext(UserConsumer)
  const isLogin = userContext && userContext.attributes && Object.keys(userContext.attributes) && Object.keys(userContext.attributes).length > 0
  const userName = userContext && userContext.attributes && userContext.attributes.email
  const [showSnackBar, setShowSnackBar] = useState(false)
  const [inviteEmail, setInviteEmail] = useState()
  const [inviteDialog, setInviteDialog] = useState(false)
  const [waitingForAPI, setWaitingForAPI] = useState(false)
  const [snackMessage, setSnackMessage] = useState('')
  const [snackMessageType, setSnackMessageType] = useState('error')
  const [pollInfo, setPollInfo] = useState()
  const [addedOptionsArray, setAddedOptionsArray] = useState([])
  const loadedRef = useRef(false)
  const closeSnackbarVisibility = () => {
    setShowSnackBar(false)
    setSnackMessage('')
  }
  const showSnackBarFunc = (message, type) => {
    setShowSnackBar(true)
    setSnackMessage(message)
    setSnackMessageType(type)
  }
  const teamData = useContext(TeamContext)
  const [pollId, setPollId] = React.useState()
  const isAnonymityButtonEnabled = teamData.customFeatures && teamData.customFeatures.anonymityButton && teamData.customFeatures.anonymityButton.isEnabled === false ? teamData.customFeatures.anonymityButton.isEnabled : true
  const getPoll = async (id) => {
    try {
      setWaitingForAPI(true)
      const params = [{ param: '{actionName}', value: 'getPoll' }]
      const postData = {
        body: {
          teamId: helper.getDomain(),
          pollId: id
        }
      }
      const address = helper.metaMaskAddress()
      if (address) {
        postData.body.address = address
      }
      const res = await httpHelper.post(urlConstants.action, httpHelper.getUri(urlConstants.action, params), postData)
      loadedRef.current = true
      const pollInfo = pollVoteCalculatePercentage(res.Item)
      const pollInfoCopy = cloneDeep(res)
      pollInfoCopy.Item = pollInfo
      setPollInfo(pollInfoCopy)
      setWaitingForAPI(false)
      helper.updateViewAudit(id, constants.POLL_VIEW_AUDIT_TYPE)
    } catch (e) {
      setWaitingForAPI(false)
      showSnackBarFunc(constants.ERROR_MESSAGE.GET_POLL, constants.SUCCESS_MESSAGE.TYPE)
    }
  }

  const updateRecentlyViewed = async (id) => {
    try {
      if (isLogin) {
        await helper.updateRecentlyViewed('poll', id)
        userContext.getAndUpdateUserdata()
      }
    } catch (e) {
      console.log('error', e)
    }
  }

  const pollCommentCountCallback = (count) => {
    const pollInfoCopy = cloneDeep(pollInfo)
    pollInfoCopy.Item.totalCommentCount = (pollInfoCopy.Item.totalCommentCount || 0) + count
    setPollInfo(pollInfoCopy)
  }

  const sendInvite = async () => {
    const postData = {
      body: {
        url: window.location.href,
        email: [inviteEmail],
        pollId,
        pollTitle: pollInfo.Item.title,
        type: constants.INVITED_TO_POLL_VOTE
      }
    }
    try {
      setWaitingForAPI(true)
      const address = helper.metaMaskAddress()
      const startKey = helper.objToParam({ tId: helper.getDomain(), ...(address ? { address } : {}) })
      await httpHelper.post(urlConstants.sendEmail, httpHelper.getUri(urlConstants.sendEmail + startKey), postData)
      setInviteDialog(false)
      setWaitingForAPI(false)
      showSnackBarFunc(constants.SUCCESS_MESSAGE.INVITE_EMAIL, constants.SUCCESS_MESSAGE.TYPE)
    } catch (err) {
      setWaitingForAPI(false)
      await helper.handleUnauthorizedError(err)
      showSnackBarFunc(constants.ERROR_MESSAGE.INVITE_EMAIL, constants.ERROR_MESSAGE.TYPE)
    }
  }

  const submitPollVoteCallback = async (pollId, selectedOptionId) => {
    if (selectedOptionId && selectedOptionId.length) {
      setWaitingForAPI(true)
      try {
        const params = [{ param: '{actionName}', value: 'updatePollVote' }]
        const postData = {
          body: {
            teamId: helper.getDomain(),
            pollId,
            item: {
              selectedOptionId
            },
            action: constants.ACTION.CREATE
          }
        }
        const address = helper.metaMaskAddress()
        if (address) {
          postData.body.address = address
        }
        const res = await httpHelper.post(urlConstants.action, httpHelper.getUri(urlConstants.action, params), postData)
        const pollInfo = pollVoteCalculatePercentage(res.pollInfo)
        const pollInfoCopy = cloneDeep(pollInfo)
        pollInfoCopy.Item = pollInfo
        pollInfoCopy.voteInfo = res
        setPollInfo(pollInfoCopy)
        setWaitingForAPI(false)
      } catch (error) {
        setWaitingForAPI(false)
        showSnackBarFunc(constants.SUCCESS_MESSAGE.SUBMIT_VOTE, constants.SUCCESS_MESSAGE.TYPE)
      }
    }
  }

  const handleAddOptionByOthers = () => {
    const optionsCopy = cloneDeep(pollInfo && pollInfo.Item && pollInfo.Item.options)
    const id = helper.getUUID()
    const optionObj = {
      id,
      option: '',
      createdBy: userName,
      createdAt: Date.now()
    }
    const addedOptionsArrayCopy = cloneDeep(addedOptionsArray)
    addedOptionsArrayCopy.push(id)
    setAddedOptionsArray(addedOptionsArrayCopy)
    optionsCopy.push(optionObj)
    const pollInfoCopy = cloneDeep(pollInfo)
    pollInfoCopy.Item.options = optionsCopy
    setPollInfo(pollInfoCopy)
  }

  const removeOption = (index, id) => {
    const optionsCopy = cloneDeep(pollInfo && pollInfo.Item && pollInfo.Item.options)
    if (index !== -1) {
      optionsCopy.splice(index, 1)
    }
    const addedOptionsArrayCopy = cloneDeep(addedOptionsArray)
    const newOptionIndex = addedOptionsArrayCopy.indexOf(id)
    if (newOptionIndex !== -1) {
      addedOptionsArrayCopy.splice(newOptionIndex, 1)
    }
    setAddedOptionsArray(addedOptionsArrayCopy)
    const pollInfoCopy = cloneDeep(pollInfo)
    pollInfoCopy.Item.options = optionsCopy
    setPollInfo(pollInfoCopy)
  }

  const handleOptionsText = (data, index) => {
    const optionsArrayCopy = [...pollInfo.Item.options]
    optionsArrayCopy[index].option = data
  }

  const onSaveAddedOptions = async () => {
    let newOptions = []
    if (pollInfo.Item && pollInfo.Item.options && pollInfo.Item.options.length) {
      let isEmptyOption
      pollInfo.Item.options.forEach(el => {
        if (!((el.option && el.option !== '') || (el.icon && el.icon !== ''))) {
          isEmptyOption = true
        }
      })
      if (isEmptyOption) {
        showSnackBarFunc(constants.ERROR_MESSAGE.FILL_THE_EMPTY_OPTION, constants.ERROR_MESSAGE.TYPE)
        return
      }
      newOptions = pollInfo.Item.options.filter(el => addedOptionsArray.includes(el.id))
    }
    setWaitingForAPI(true)
    try {
      const params = [{ param: '{actionName}', value: 'updatePoll' }]
      const postData = {
        body: {
          teamId: helper.getDomain(),
          pollId,
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
      const pollInfoCopy = cloneDeep(pollInfo)
      pollInfoCopy.Item = res.Attributes
      setPollInfo(pollInfoCopy)
      setWaitingForAPI(false)
      showSnackBarFunc(constants.SUCCESS_MESSAGE.ADD_NEW_POLL_OPTION, constants.SUCCESS_MESSAGE.TYPE)
    } catch (error) {
      setWaitingForAPI(false)
      showSnackBarFunc(constants.ERROR_MESSAGE.ADD_NEW_POLL_OPTION, constants.ERROR_MESSAGE.TYPE)
    }
  }

  useEffect(() => {
    let copyPollId
    if (props.match && props.match.params && props.match.params.id) {
      copyPollId = props.match.params.id && props.match.params.id.includes(constants.RECENTLY_VIEWED_URL) ? props.match.params.id.slice(0, props.match.params.id.lastIndexOf(constants.RECENTLY_VIEWED_URL)) : props.match.params.id
    }
    if (copyPollId && pollId !== copyPollId) {
      setPollId(copyPollId)
      if (!loadedRef.current) {
        getPoll(copyPollId)
      }
    }
    return () => {
      const id = copyPollId || pollId
      if (id) { updateRecentlyViewed(id) }
    }
  }, [])
  return (
    <div className={classes.pollInfoRoot}>
      <Container>
        {pollInfo && pollInfo.Item
          ? <>
            <ControlledAccordion
              open={true}
              icon={<Icons.QUESTION_ANSWER_TWO_TONE_ICON color="primary" />}
              title={'Poll'}
              cardComponent={<PollView pollId={pollId} pollInfo={pollInfo} submitPollVoteCallback={submitPollVoteCallback} waitingForAPI={waitingForAPI} handleInvite={(type) => setInviteDialog(true)} handleAddOptionByOthers={handleAddOptionByOthers} removeOption={removeOption} handleOptionsText={handleOptionsText} onSaveAddedOptions={onSaveAddedOptions} addedOptionsArray={addedOptionsArray} />} />
            <ControlledAccordion
              open={true}
              icon={<Icons.QUESTION_ANSWER_TWO_TONE_ICON color="primary" />}
              title={'Comments'}
              cardComponent={<CommentView pollId={pollId} {...props} isAnonymityButtonEnabled={isAnonymityButtonEnabled} pollCommentCountCallback={pollCommentCountCallback} />} />
          </>
          : waitingForAPI && <Loading />}
        {inviteDialog && <TextFieldDialog
          title={<FormattedMessage id="dialogTitleVoter" />}
          contentText={<FormattedMessage id="dialogContentTextPollVoter" />}
          buttonText={<FormattedMessage id="invite" />}
          open={inviteDialog}
          textFieldType="email"
          waitingForAPI={waitingForAPI}
          textFieldLabel={<FormattedMessage id="emailAddress" />}
          close={() => setInviteDialog(!inviteDialog)}
          textFieldCallback={(value) => setInviteEmail(value)}
          textFieldValue={inviteEmail}
          submitDialog={sendInvite} />}
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
      </Container>
    </div>
  )
}

PollInfo.propTypes = {
  match: PropTypes.object
}

export default memo(PollInfo)
