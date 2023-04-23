import React, { memo, useContext, useEffect, useState, useRef } from 'react'
import PropTypes from 'prop-types'
import makeStyles from '@material-ui/core/styles/makeStyles'
import Container from '@material-ui/core/Container'
import httpHelper from '../../../shared/httpHelper'
import urlConstants from '../../../constants/urlConstants'
import helper from '../../../shared/helper'
import constants from '../../../constants/constants'
import AppSnackbar from '../../../actions/snackbar'
import { pollVoteCalculatePercentage } from '../../../shared/utils'
import cloneDeep from 'lodash/cloneDeep'
import { UserConsumer } from '../../../context/UserContext'
import { useSubscription, gql } from '@apollo/client'
import PollPreviewCard from './PollPreviewCard'

const useStyles = makeStyles((theme) => ({
  pollInfoRoot: {
    width: '100%',
    backgroundColor: 'rgba(255, 0, 0, 0.0)',
    '& .MuiContainer-root': {
      paddingLeft: '0px',
      paddingRight: '0px',
      maxWidth: '93%',
      paddingTop: '2%',
      paddingBottom: '2%'
    }
  }
}))

function OpenPoll (props) {
  const classes = useStyles()
  const userContext = useContext(UserConsumer)
  const isLogin = userContext && userContext.attributes && Object.keys(userContext.attributes) && Object.keys(userContext.attributes).length > 0
  const [showSnackBar, setShowSnackBar] = useState(false)
  const [waitingForAPI, setWaitingForAPI] = useState(false)
  const [waitingForSubmitVoteAPI, setWaitingForSubmitVoteAPI] = useState(false)
  const [snackMessage, setSnackMessage] = useState('')
  const [snackMessageType, setSnackMessageType] = useState('error')
  const [pollInfo, setPollInfo] = useState()
  const [liveVoteUserId, setLiveVoteUserId] = useState()
  const [liveVoteStatus, setLiveVoteStatus] = useState()
  const [voteInfo, setVoteInfo] = useState({})
  const [voterList, setVoterList] = useState([])
  const [nonLoggedInUserIdState, setNonLoggedInUserIdState] = useState(null)
  const [pollId, setPollId] = useState()
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

  const getPoll = async (id) => {
    try {
      setWaitingForAPI(true)
      const params = [{ param: '{actionName}', value: 'getPoll' }]
      const postData = {
        body: {
          teamId: helper.getDomain(),
          pollId: id,
          nonLoggedInUserId: getNonLoggedInUserStatus()
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
      setVoteInfo(res && res.voteInfo ? res.voteInfo : {})
      setVoterList(res && res.voterList ? res.voterList : [])
      setWaitingForAPI(false)
      setLiveVoteStatus(false)
      // helper.updateViewAudit(id, constants.POLL_VIEW_AUDIT_TYPE)
    } catch (e) {
      setWaitingForAPI(false)
      setLiveVoteStatus(false)
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

  const submitPollVoteCallback = async (pollId, selectedOptionId) => {
    if (selectedOptionId && selectedOptionId.length) {
      setWaitingForSubmitVoteAPI(true)
      setWaitingForAPI(true)
      try {
        const nonLoggedInUserId = nonLoggedInUserIdState || 'nonLoggedInUser' + '|' + helper.getUUID()
        const teamId = helper.getDomain()
        const params = [{ param: '{actionName}', value: 'updatePollVote' }]
        const postData = {
          body: {
            teamId,
            pollId,
            nonLoggedInUserId,
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
        setVoteInfo(res || {})
        setWaitingForAPI(false)
        setWaitingForSubmitVoteAPI(false)
        localStorage.setItem(`${teamId}-nonLoggedInUserId`, nonLoggedInUserId)
      } catch (error) {
        setWaitingForAPI(false)
        setWaitingForSubmitVoteAPI(false)
        showSnackBarFunc(constants.SUCCESS_MESSAGE.SUBMIT_VOTE, constants.SUCCESS_MESSAGE.TYPE)
      }
    }
  }

  const updatePollOptions = (optionsCopy) => {
    const pollInfoCopy = cloneDeep(pollInfo)
    pollInfoCopy.Item.options = optionsCopy
    setPollInfo(pollInfoCopy)
  }

  const updatePollInfo = (data) => {
    const pollInfoCopy = cloneDeep(pollInfo)
    pollInfoCopy.Item = data
    setPollInfo(pollInfoCopy)
  }

  const handleOptionsText = (data, index) => {
    const optionsArrayCopy = [...pollInfo.Item.options]
    optionsArrayCopy[index].option = data
  }

  const getNonLoggedInUserStatus = () => {
    const teamId = helper.getDomain()
    const nonLoggedInUserId = localStorage.getItem(`${teamId}-nonLoggedInUserId`)
    if (nonLoggedInUserId) {
      setNonLoggedInUserIdState(nonLoggedInUserId)
    }
    return nonLoggedInUserId
  }

  const { data } = useSubscription(
    gql`
      subscription MySubscription($email: String!, $teamId: String!) {
        onCreateSwaeAppNotification(email: $email, teamId: $teamId) {
          documentId
          email
          id
          teamId
          type
          url
          userName
        }
      }
    `,
    {
      variables: {
        email: `${helper.getDomain()}-${pollId}`,
        teamId: helper.getDomain()
      }
    }
  )
  if (data && data.onCreateSwaeAppNotification && data.onCreateSwaeAppNotification.userName !== liveVoteUserId && data.onCreateSwaeAppNotification.type === 'pollLiveVote') {
    setLiveVoteStatus(true)
    setLiveVoteUserId(data.onCreateSwaeAppNotification.userName)
    getPoll(pollId)
    getNonLoggedInUserStatus()
  }

  useEffect(() => {
    if (props && props.match && props.match.params && props.match.params.id && pollId !== props.match.params.id) {
      setPollId(props.match.params.id)
      if (!loadedRef.current) {
        getPoll(props.match.params.id)
        getNonLoggedInUserStatus()
      }
    }
    return () => {
      const id = props && props.match && props.match.params && props.match.params.id ? props.match.params.id : pollId
      if (id) { updateRecentlyViewed(id) }
    }
  }, [])
  return (
    <div className={classes.pollInfoRoot}>
      <Container>
        <PollPreviewCard poll={pollInfo && pollInfo.Item} liveVoteStatus={liveVoteStatus} waitingForSubmitVoteAPI={waitingForSubmitVoteAPI} isNonLoggedInView={true} voteInfo={voteInfo} voterList={voterList} waitingForAPI={waitingForAPI} submitPollVoteCallback={submitPollVoteCallback} updatePollOptions={updatePollOptions} handleOptionsText={handleOptionsText} updatePollInfo={updatePollInfo} />
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

OpenPoll.propTypes = {
  match: PropTypes.object
}

export default memo(OpenPoll)
