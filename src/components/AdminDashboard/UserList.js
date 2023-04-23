import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import Divider from '@mui/material/Divider'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Avatar from '@mui/material/Avatar'
import ListItemButton from '@mui/material/ListItemButton'
import makeStyles from '@mui/styles/makeStyles'
import InfiniteScroll from 'react-infinite-scroll-component'
import * as moment from 'moment'

const useStyles = makeStyles((theme) => ({
  root: {
    height: '300px',
    borderStyle: 'solid',
    borderColor: 'rgba(0, 0, 0, 0.12)',
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
      // paddingRight: '16px'
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

export default function UserList(props) {
  const classes = useStyles()
  const { users, selectUserCallback, selectedIndex, waitingForAPI, nextUsers, hasMoreUsers } = props
  return (
    <div id="scrollableDiv" className={classes.root}>
      <List>
        {users && users.length
          ? <InfiniteScroll
            dataLength={users.length}
            next={nextUsers}
            hasMore={hasMoreUsers}
            loader={<h1>Loading...</h1>}
            scrollableTarget="scrollableDiv"
          >
            {users.map((el, index) => <React.Fragment key={index}>
              <ListItem alignItems="flex-start">
                <ListItemButton
                  selected={selectedIndex === index}
                  onClick={() => selectUserCallback(index)}
                >
                  <ListItemAvatar>
                    <div className={classes.listAvatarContainer}>
                      <Avatar alt={el.firstname} src={el.profilePic || ''} sx={{ width: 32, height: 32 }} />
                    </div>
                  </ListItemAvatar>
                  <ListItemText
                    primary={<span className="font-family-normal-15">{el.firstname}</span>}
                  />
                </ListItemButton>
              </ListItem>
              {index !== users.length - 1 && <Divider component="li" />}
            </React.Fragment>)}
          </InfiniteScroll>
          : !waitingForAPI ? <h1>No users!</h1> : <h1>Loading...</h1>}
      </List>
    </div>
  )
}

UserList.propTypes = {
  users: PropTypes.array,
  selectUserCallback: PropTypes.func,
  selectedIndex: PropTypes.number,
  waitingForAPI: PropTypes.bool,
  nextUsers: PropTypes.func,
  hasMoreUsers: PropTypes.bool
}

