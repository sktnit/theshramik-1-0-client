import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import Divider from '@mui/material/Divider'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Avatar from '@mui/material/Avatar'
import ListItemButton from '@mui/material/ListItemButton'
import { makeStyles } from '@material-ui/core/styles'
import Loading from '../../../layout/Loading'
import NoItem from '../../../layout/NoItem'
import { Translate } from 'react-auto-translate'
import InfiniteScroll from 'react-infinite-scroll-component'
import { StartFlagIcon } from '../../../constants/svg/StartFlagIcon'
import { EndFlagIcon } from '../../../constants/svg/EndFlagIcon'
import * as moment from 'moment'
import TeamContext from '../../../context/TeamContext'

const useStyles = makeStyles((theme) => ({
  root: {
    maxHeight: 'calc(100vh - 210px)',
    overflowY: 'auto',
    scrollBehavior: 'smooth',
    '&::-webkit-scrollbar': {
      width: '8px'
    },
    '&::-webkit-scrollbar-track': {
      boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
      webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)'
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: '#DFDFDF',
      borderRadius: '15px'
    },
    '& .MuiList-root': {
      maxWidth: 'none',
      paddingRight: '16px'
    },
    '& .MuiListItem-root': {
      padding: 0
    },
    '& .MuiListItemButton-root': {
      height: '80px',
      // alignItems: 'flex-start',

      alignItems: 'center'
    },
    '& .MuiListItemButton-root.Mui-selected': {
      backgroundColor: theme.palette.grey.grey8
    },
    '& .MuiListItemAvatar-root': {
      minWidth: '42px',
      // marginTop: '8px',

      height: '100%',
      alignItems: 'center',
      display: 'flex'
    },
    '& .MuiTypography-root': {
      color: theme.palette.primary.text,
      height: '42px',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      display: '-webkit-box',
      wordBreak: 'break-word',
      '-webkit-line-clamp': 2,
      '-webkit-box-orient': 'vertical'
    }
  },
  listAvatarContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  avatarBorderSolid: {
    border: `solid 2px ${theme.palette.primary.main}`
  },
  flagIcon: {
    position: 'relative',
    top: '8px'
  }
}))

export default function PollsList (props) {
  const classes = useStyles()
  const teamData = useContext(TeamContext)
  const { polls, selectPollCallback, selectedIndex, waitingForAPI, nextPolls, hasMorePolls } = props
  return (
    <div id="scrollableDiv" className={classes.root}>
      <List>
        {polls && polls.length
          ? <InfiniteScroll
            dataLength={polls.length}
            next={nextPolls}
            hasMore={hasMorePolls}
            loader={<Loading />}
            scrollableTarget="scrollableDiv"
          >
            {polls.map((el, index) => <React.Fragment key={index}>
              <ListItem alignItems="flex-start">
                <ListItemButton selected={selectedIndex === index} onClick={() => selectPollCallback(index)}>
                  <ListItemAvatar>
                    <div className={classes.listAvatarContainer}>
                      <Avatar alt={el.createdByName} src={el.isAnonymous ? teamData && teamData.anonymousIconUrls && teamData.anonymousIconUrls.anonymous ? teamData.anonymousIconUrls.anonymous : '' : el.creatorImage} sx={{ width: 32, height: 32 }} className={el.isAnonymous ? classes.avatarBorderSolid : ''} />
                      {((el.endTime > moment().unix() * 1000) || el.continuous) ? <div className={classes.flagIcon}><StartFlagIcon /></div> : <div className={classes.flagIcon}><EndFlagIcon /></div>}
                    </div>
                  </ListItemAvatar>
                  <ListItemText
                    primary={<span className="font-family-normal-15">{el.title}</span>}
                  />
                </ListItemButton>
              </ListItem>
              {index !== polls.length - 1 && <Divider component="li" />}
            </React.Fragment>)}
          </InfiniteScroll>
          : !waitingForAPI ? <NoItem message={<Translate>No Polls!</Translate>} /> : <Loading />}
      </List>
    </div>
  )
}

PollsList.propTypes = {
  polls: PropTypes.array,
  selectPollCallback: PropTypes.func,
  selectedIndex: PropTypes.number,
  waitingForAPI: PropTypes.bool,
  nextPolls: PropTypes.func,
  hasMorePolls: PropTypes.bool
}
