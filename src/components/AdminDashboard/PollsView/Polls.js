import React, { memo } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import { PollsIcon } from '../../../constants/svg/PollsIcon'
import Theme from '../../../theme'
import Container from '@material-ui/core/Container'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import PropTypes from 'prop-types'
import orderBy from 'lodash/orderBy'
import PollsList from './PollsList'
import PollCategories from './PollCategories'
import PollPreviewCard from './PollPreviewCard'
import cloneDeep from 'lodash/cloneDeep'
import httpHelper from '../../../shared/httpHelper'
import urlConstants from '../../../constants/urlConstants'
import Button from '@mui/material/Button'
import { FormattedMessage } from 'react-intl'
import Icons from '../../../constants/Icons'
import Loading from '../../../layout/Loading'
import helper from '../../../shared/helper'
import constants from '../../../constants/constants'
import { UserConsumer } from '../../../context/UserContext'
import CreatePollDialog from '../CreatePoll/CreatePollDialog'
import { pollVoteCalculatePercentage } from '../../../shared/utils'

function TabPanel (props) {
  const { children, value, index, polls, selectPollCallback, selectedIndex, waitingForAPI, nextPolls, hasMorePolls, pollTags, waitingForPollTagAPI, selectedTags, selectPollCategory, myPollsMenuItem, selectedMenuIndex, handleSelectMyPollMenu, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: '16px 0px' }}>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <PollCategories pollTags={pollTags} waitingForPollTagAPI={waitingForPollTagAPI} selectedTags={selectedTags} selectPollCategory={selectPollCategory} tabValue={value} myPollsMenuItem={myPollsMenuItem} selectedMenuIndex={selectedMenuIndex} handleSelectMyPollMenu={handleSelectMyPollMenu} />
            </Grid>
            <Grid item xs={8}>
              <PollsList polls={polls} waitingForAPI={waitingForAPI} selectPollCallback={selectPollCallback} selectedIndex={selectedIndex} nextPolls={nextPolls} hasMorePolls={hasMorePolls} />
            </Grid>
          </Grid>
        </Box>
      )}
    </div>
  )
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired
}

function a11yProps (index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  }
}

const useStyles = makeStyles((theme) => ({
  root: {
    // position: 'fixed',
    '& .MuiTab-root': {
      padding: 0,
      marginRight: '16px',
      minHeight: '48px',
      textTransform: 'none',
      color: theme.palette.primary.text
    },
    '& .MuiTab-root.Mui-selected': {
      color: theme.palette.primary.main
    },
    '& .MuiButtonBase-root.MuiTab-root': {
      flexDirection: 'inherit',
      justifyContent: 'flex-start'
    },
    '& .MuiTabs-indicator': {
      backgroundColor: theme.palette.primary.main
    },
    '& .MuiTabs-root': {
      minHeight: '48px',
      borderBottom: '1px solid rgba(0, 0, 0, 0.12)'
    }
  },
  outerTabContainer: {
    position: 'relative'
  },
  tabActions: {
    position: 'absolute',
    top: '8px',
    right: 0
  },
  submitBtnContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginLeft: '8px',
    '& .MuiButton-containedPrimary': {
      color: theme.palette.white.white1,
      textTransform: 'none',
      borderRadius: '22px',
      fontSize: '14px',
      fontFamily: 'Poppins',
      padding: '2px 10px'
    }
  },
  arrowRightIcon: {
    fontSize: '24px !important'
  }
}))

function Polls (props) {
  const classes = useStyles()
  const context = React.useContext(UserConsumer)
  const email = context && context.attributes && context.attributes.email
  const [waitingForAPI, setWaitingForAPI] = React.useState(true)
  const [value, setValue] = React.useState(props.isMyPolls ? 1 : 0)
  const [pollState, setPollState] = React.useState(constants.POLL_STATE.CREATED)
  const [selectedIndex, setSelectedIndex] = React.useState(-1)
  const [polls, setPolls] = React.useState([])
  const [from, setFrom] = React.useState(0)
  const [hasMorePolls, setHasMorePolls] = React.useState(false)
  const [readyToDisplay, setReadyToDisplay] = React.useState(false)
  const [waitingForGetPollAPI, setWaitingForGetPollAPI] = React.useState(false)
  const [voteInfo, setVoteInfo] = React.useState({})
  const [voterList, setVoterList] = React.useState([])
  const [pollTags, setPollTags] = React.useState([])
  const [waitingForPollTagAPI, setWaitingForPollTagAPI] = React.useState(false)
  const [selectedTags, setSelectedTags] = React.useState([])
  const [isOwn, setIsOwn] = React.useState(props.isMyPolls || false)
  const [openCreatePollDialog, setOpenCreatePollDialog] = React.useState((props.history && props.history.location && props.history.location.state && props.history.location.state.openCreatePollDialog) || false)
  const [selectedMenuIndex, setSelectedMenuIndex] = React.useState(0)
  const [isBookmarks, setIsBookmarks] = React.useState(false)
  const myPollsMenuItem = ['All My Polls', 'My Draft Polls', 'My Active Polls', 'My Closed Polls', 'My Bookmarked Polls']

  const handleCreateDialogOpen = () => {
    setOpenCreatePollDialog(true)
  }

  const scrollToTop = () => {
    if (document && document.getElementById('scrollableDiv')) {
      document.getElementById('scrollableDiv').scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }
  }

  const handleCreateDialogClose = (doFetchPolls) => {
    const tabValue = value
    setValue(0)
    if (doFetchPolls || tabValue === 1) {
      setSelectedIndex(-1)
      scrollToTop()
      getPolls(0, false, [], constants.POLL_STATE.CREATED)
    }
    setOpenCreatePollDialog(false)
  }

  const handleTabChange = (event, newValue) => {
    const state = newValue === 0 ? constants.POLL_STATE.CREATED : newValue === 1 ? undefined : constants.POLL_STATE.CREATED
    const isOwn = newValue === 0 ? false : newValue === 1
    setValue(newValue)
    setPollState(state)
    setIsOwn(isOwn)
    setSelectedIndex(-1)
    setSelectedTags([])
    setSelectedMenuIndex(0)
    getPolls(0, isOwn, [], state, false)
  }

  const getTags = async () => {
    setWaitingForPollTagAPI(true)
    try {
      const params = [{ param: '{actionName}', value: 'getTeamInfo' }]
      const postData = {
        body: {
          teamId: helper.getDomain()
        }
      }
      const data = await httpHelper.post(urlConstants.action, httpHelper.getUri(urlConstants.action, params), postData)
      console.log('GetPollTags', data)
      let setData = data && data.Item && data.Item.pollTags ? data.Item.pollTags : []
      setData = orderBy(setData, ['createdAt'], ['desc'])
      setData = orderBy(setData, ['count'], ['desc'])
      setData = setData.splice(0, 5)
      setData.unshift(constants.SHOW_ALL_POLL)
      setPollTags(setData)
      setWaitingForPollTagAPI(false)
    } catch (error) {
      console.log('Error in getTags', error)
      setWaitingForPollTagAPI(false)
    }
  }

  const selectPollCategory = async (name) => {
    let selectedTagsCopy = cloneDeep(selectedTags)
    if (selectedTagsCopy.includes(name)) {
      const index = selectedTagsCopy.indexOf(name)
      if (index > -1) {
        selectedTagsCopy.splice(index, 1)
      }
    } else {
      selectedTagsCopy = [name]
    }
    setSelectedIndex(-1)
    setSelectedTags(name === constants.SHOW_ALL_POLL.name ? [] : selectedTagsCopy)
    scrollToTop()
    await getPolls(0, isOwn, (name === constants.SHOW_ALL_POLL.name ? [] : selectedTagsCopy), pollState, false)
  }

  const handleSelectMyPollMenu = async (index) => {
    setSelectedIndex(-1)
    setSelectedMenuIndex(index)
    scrollToTop()
    if (index === 0) {
      setIsOwn(true)
      setPollState(undefined)
      setIsBookmarks(false)
      await getPolls(0, true, [], undefined, false)
    } else if (index === 1) {
      setIsOwn(true)
      setPollState(constants.POLL_STATE.DRAFT)
      setIsBookmarks(false)
      await getPolls(0, true, [], constants.POLL_STATE.DRAFT, false)
    } else if (index === 2) {
      setIsOwn(true)
      setPollState(constants.POLL_STATE.ACTIVE)
      setIsBookmarks(false)
      await getPolls(0, true, [], constants.POLL_STATE.ACTIVE, false)
    } else if (index === 3) {
      setIsOwn(true)
      setPollState(constants.POLL_STATE.CLOSED)
      setIsBookmarks(false)
      await getPolls(0, true, [], constants.POLL_STATE.CLOSED, false)
    } else if (index === 4) {
      setIsOwn(false)
      setPollState(constants.POLL_STATE.CREATED)
      setIsBookmarks(true)
      await getPolls(0, false, [], constants.POLL_STATE.CREATED, true)
    }
  }

  const submitPollVoteCallback = async (pollId, selectedOptionId) => {
    if (selectedOptionId && selectedOptionId.length) {
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
        console.log('UpdatePollVote', res)
        const pollInfo = pollVoteCalculatePercentage(res.pollInfo)
        const pollsCopy = cloneDeep(polls)
        const pollIndex = pollsCopy.findIndex(el => el.pollId === res.pollId)
        pollsCopy[pollIndex] = pollInfo
        setVoteInfo(res || {})
        setPolls(pollsCopy)
      } catch (error) {
        console.log('Error in updatePollVote', error)
      }
    }
  }

  const getPolls = async (from, isOwn, tags, state, isBookmarks) => {
    setWaitingForAPI(true)
    try {
      const params = [{ param: '{actionName}', value: 'getPolls' }]
      const postData = {
        body: {
          from,
          pgsize: constants.PAGE_SIZE.poll,
          isOwn,
          state,
          isBookmarks,
          // searchText: 'Poll',
          tags,
          sortBy: 0,
          teamId: helper.getDomain()
        }
      }
      const address = helper.metaMaskAddress()
      if (address) {
        postData.body.address = address
      }
      const res = await httpHelper.post(urlConstants.action, httpHelper.getUri(urlConstants.action, params), postData)
      console.log('GetPolls', res)
      const setData = polls && polls.length && from !== 0 ? (cloneDeep(polls)).concat(cloneDeep(res.Data)) : res && cloneDeep(res.Data)
      setPolls(setData)
      setHasMorePolls(setData.length !== res.Count)
      setFrom(from + constants.PAGE_SIZE.poll)
      setWaitingForAPI(false)
      setReadyToDisplay(true)
    } catch (error) {
      console.log('Error in getPolls', error)
      setWaitingForAPI(false)
    }
  }

  const nextPolls = async () => {
    await getPolls(from, isOwn, selectedTags, pollState, isBookmarks)
  }

  const selectPollCallback = async (index) => {
    setSelectedIndex(index)
    setWaitingForGetPollAPI(true)
    try {
      const params = [{ param: '{actionName}', value: 'getPoll' }]
      const postData = {
        body: {
          teamId: helper.getDomain(),
          pollId: polls[index].pollId
        }
      }
      const address = helper.metaMaskAddress()
      if (address) {
        postData.body.address = address
      }
      const res = await httpHelper.post(urlConstants.action, httpHelper.getUri(urlConstants.action, params), postData)
      console.log('GetPoll', res)
      let setData = res && res.Item ? res.Item : {}
      if (res && res.voteInfo && Object.keys(res.voteInfo) && Object.keys(res.voteInfo).length) {
        setData = pollVoteCalculatePercentage(setData)
      }
      const pollsCopy = cloneDeep(polls)
      const pollIndex = pollsCopy.findIndex(el => el.pollId === setData.pollId)
      pollsCopy[pollIndex] = setData
      setVoteInfo(res && res.voteInfo ? res.voteInfo : {})
      setVoterList(res && res.voterList ? res.voterList : [])
      setPolls(pollsCopy)
      setWaitingForGetPollAPI(false)
      helper.updateViewAudit(polls[index].pollId, constants.POLL_VIEW_AUDIT_TYPE)
    } catch (error) {
      console.log('Error in getPoll', error)
      setWaitingForGetPollAPI(false)
    }
  }

  const handleBookmark = async (pollId, bookmarks) => {
    try {
      const params = [{ param: '{actionName}', value: 'updatePoll' }]
      const postData = {
        body: {
          teamId: helper.getDomain(),
          pollId,
          isBookmarks: !(bookmarks && bookmarks.includes(email))
        }
      }
      const address = helper.metaMaskAddress()
      if (address) {
        postData.body.address = address
      }
      const res = await httpHelper.post(urlConstants.action, httpHelper.getUri(urlConstants.action, params), postData)
      console.log('UpdatePollBookmark', res)
      const pollInfo = pollVoteCalculatePercentage(res.Attributes)
      const pollsCopy = cloneDeep(polls)
      const pollIndex = pollsCopy.findIndex(el => el.pollId === pollId)
      pollsCopy[pollIndex] = cloneDeep(pollInfo)
      setPolls(pollsCopy)
    } catch (error) {
      console.log('Error in updatePollVote', error)
    }
  }

  const updatePollOptions = (optionsCopy) => {
    const pollsCopy = cloneDeep(polls)
    pollsCopy[selectedIndex].options = optionsCopy
    setPolls(pollsCopy)
  }

  const updatePollInfo = (data) => {
    const pollsCopy = cloneDeep(polls)
    pollsCopy[selectedIndex] = data
    setPolls(pollsCopy)
  }

  const handleOptionsText = (data, index) => {
    const optionsArrayCopy = [...polls[selectedIndex].options]
    optionsArrayCopy[index].option = data
  }
  React.useEffect(() => {
    getTags()
    getPolls(from, isOwn, selectedTags, pollState)
  }, [])

  return (
    <Container className={classes.root}>
      {readyToDisplay
        ? <Grid container spacing={2}>
          <Grid item xs={7}>
            <div className={classes.outerTabContainer}>
              {!props.isMyPolls && <Tabs
                value={value}
                onChange={handleTabChange}
                aria-label="icon position tabs example"
              >
                <Tab icon={<PollsIcon color={Theme.palette.primary.main} width='30' height='30' />} iconPosition="start" label={<span className="font-family-semi-bold-16">Polls</span>} {...a11yProps(0)} className="font-family-semi-bold-18" />
                <Tab iconPosition="bottom" label={<span className="font-family-semi-bold-16">My Polls</span>} {...a11yProps(1)} />
              </Tabs>}
              <TabPanel value={value} index={0} polls={polls} waitingForAPI={waitingForAPI} selectPollCallback={selectPollCallback} selectedIndex={selectedIndex} nextPolls={nextPolls} hasMorePolls={hasMorePolls} pollTags={pollTags} waitingForPollTagAPI={waitingForPollTagAPI} selectedTags={selectedTags} selectPollCategory={selectPollCategory} />
              <TabPanel value={value} index={1} polls={polls} waitingForAPI={waitingForAPI} selectPollCallback={selectPollCallback} selectedIndex={selectedIndex} nextPolls={nextPolls} hasMorePolls={hasMorePolls} pollTags={pollTags} waitingForPollTagAPI={waitingForPollTagAPI} selectedTags={selectedTags} selectPollCategory={selectPollCategory} myPollsMenuItem={myPollsMenuItem} selectedMenuIndex={selectedMenuIndex} handleSelectMyPollMenu={handleSelectMyPollMenu} />
              {!props.isMyPolls && <div className={classes.tabActions}>
                <div className={classes.submitBtnContainer}>
                  <Button variant="contained" color="primary" size="small" endIcon={<Icons.ARROW_RIGHT_ICON className={classes.arrowRightIcon} />} onClick={handleCreateDialogOpen} className="" >
                    <span className="font-family-semi-bold-15"><FormattedMessage id="newPoll" /></span>
                  </Button>
                </div>
              </div>}
            </div>
          </Grid>
          <Grid item xs={5}>
            {selectedIndex !== -1 && <PollPreviewCard poll={polls[selectedIndex]} voteInfo={voteInfo} voterList={voterList} waitingForAPI={waitingForGetPollAPI} submitPollVoteCallback={submitPollVoteCallback} handleBookmark={handleBookmark} updatePollOptions={updatePollOptions} updatePollInfo={updatePollInfo} handleOptionsText={handleOptionsText} />}
          </Grid>
        </Grid>
        : <Loading />}
      {openCreatePollDialog && <CreatePollDialog close={handleCreateDialogClose} open={openCreatePollDialog} />}
    </Container>
  )
}

TabPanel.propTypes = {
  polls: PropTypes.array,
  selectPollCallback: PropTypes.func,
  selectedIndex: PropTypes.number,
  waitingForAPI: PropTypes.bool,
  nextPolls: PropTypes.func,
  hasMorePolls: PropTypes.bool,
  pollTags: PropTypes.array,
  waitingForPollTagAPI: PropTypes.bool,
  selectedTags: PropTypes.array,
  selectPollCategory: PropTypes.func,
  myPollsMenuItem: PropTypes.array,
  selectedMenuIndex: PropTypes.number,
  handleSelectMyPollMenu: PropTypes.func
}

Polls.propTypes = {
  history: PropTypes.object,
  isMyPolls: PropTypes.bool
}

export default memo(Polls)
